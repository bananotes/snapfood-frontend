import requests
from apify_client import ApifyClient
import os
import time
import json
import re

# Initialize the ApifyClient with your API token
client = ApifyClient("XXXXX")
GOOGLE_MAPS_API_KEY = "XXXXXXX"
latitude = 48.862824
longitude = 2.322437

# Create outputs directory if it doesn't exist
outputs_dir = "outputs"
if not os.path.exists(outputs_dir):
    os.makedirs(outputs_dir)


def sanitize_filename(text):
    """
    Clean text to be safe for filename
    """
    # Remove special characters and replace spaces with underscores
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '_', text)
    return text[:50]  # Limit length


def generate_filename(lat, lng, first_restaurant_data):
    """
    Generate filename based on coordinates and first restaurant info
    """
    # Format coordinates
    lat_str = f"{lat:.4f}".replace('.', '_')
    lng_str = f"{lng:.4f}".replace('.', '_')

    # Get first restaurant info
    restaurant_name = sanitize_filename(
        first_restaurant_data.get('name', 'unknown'))

    # Extract city/area from address
    address = first_restaurant_data.get('vicinity', '')
    city = 'unknown'
    if address:
        # Try to extract city name (usually after last comma)
        parts = address.split(',')
        if len(parts) >= 2:
            city = sanitize_filename(parts[-2].strip())
        else:
            city = sanitize_filename(parts[0].strip())

    filename = f"restaurants_photos_{lat_str}_{lng_str}_{city}_{restaurant_name}.json"
    return filename


# Define output file path
output_file = os.path.join(outputs_dir, "restaurants_photos.json")


def load_existing_data():
    """
    Load existing restaurant data from JSON file
    """
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []


def save_restaurant_data(all_data):
    """
    Save restaurant data to JSON file
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)


def is_restaurant_processed(place_id, existing_data):
    """
    Check if restaurant is already processed
    """
    for restaurant in existing_data:
        if restaurant.get('place_id') == place_id:
            return True
    return False


def get_nearby_restaurants(lat, lng, radius=1000, max_results=20):
    """
    Get nearby restaurants using Google Places New API with direct HTTP request
    """
    try:
        url = "https://places.googleapis.com/v1/places:searchNearby"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.formattedAddress,places.types"
        }

        body = {
            "includedTypes": ["restaurant"],
            "maxResultCount": max_results,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lng
                    },
                    "radius": float(radius)
                }
            }
        }

        print(f"Requesting Google Places API...")
        response = requests.post(url, headers=headers, json=body)

        if response.status_code == 200:
            data = response.json()
            restaurants = []

            for place in data.get('places', []):
                restaurant_info = {
                    'name': place.get('displayName', {}).get('text', ''),
                    'place_id': place.get('id', ''),
                    'rating': place.get('rating'),
                    'vicinity': place.get('formattedAddress', ''),
                    'types': place.get('types', [])
                }
                restaurants.append(restaurant_info)

            return restaurants
        else:
            print(
                f"API request failed: {response.status_code} - {response.text}")
            return []

    except Exception as e:
        print(f"Error fetching restaurants: {e}")
        return []


def get_restaurant_photos(place_id, restaurant_name):
    """
    Use Apify to get restaurant photos URLs
    """
    try:
        # Prepare the Actor input
        run_input = {
            "includeWebResults": False,
            "language": "en",
            "maxCrawledPlacesPerSearch": 1,
            "maxImages": 50,
            "maximumLeadsEnrichmentRecords": 0,
            "placeIds": [
                place_id
            ],
            "scrapeContacts": False,
            "scrapeDirectories": False,
            "scrapeImageAuthors": False,
            "scrapePlaceDetailPage": False,
            "scrapeReviewsPersonalData": False,
            "scrapeTableReservationProvider": False,
            "skipClosedPlaces": False
        }

        # Run the Actor and wait for it to finish
        print(f"Getting photos for {restaurant_name}...")
        run = client.actor("nwua9Gu5YrADL7ZDj").call(run_input=run_input)

        # Fetch Actor results from the run's dataset
        photo_urls = []
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            if 'imageUrls' in item and item['imageUrls']:
                photo_urls = item['imageUrls']
                print(f"Found {len(photo_urls)} photos")
                break

        return photo_urls

    except Exception as e:
        print(f"Error fetching restaurant photos for {restaurant_name}: {e}")
        return []


# Get nearby restaurants first to determine filename
print(
    f"Searching for restaurants near coordinates ({latitude}, {longitude})...")
restaurants = get_nearby_restaurants(latitude, longitude, max_results=20)

if not restaurants:
    print("No restaurants found, exiting program")
    exit()

# Generate dynamic filename based on first restaurant
output_filename = generate_filename(latitude, longitude, restaurants[0])
output_file = os.path.join(outputs_dir, output_filename)

print(f"Output file: {output_file}")

# Load existing data
all_restaurants_data = load_existing_data()
print(f"Loaded {len(all_restaurants_data)} existing records")

print(f"\nFound {len(restaurants)} restaurants:")
print("-" * 80)

# Process each restaurant
processed_count = 0
skipped_count = 0

for i, restaurant in enumerate(restaurants, 1):
    print(f"\n{i}. Checking restaurant: {restaurant['name']}")
    print(f"   Place ID: {restaurant['place_id']}")

    # Check if already processed
    if is_restaurant_processed(restaurant['place_id'], all_restaurants_data):
        print(f"   ✓ Already processed, skipping")
        skipped_count += 1
        continue

    print(f"   → Starting processing...")

    # Get restaurant photos from Apify
    photo_urls = get_restaurant_photos(
        restaurant['place_id'], restaurant['name'])

    restaurant_data = {
        'restaurant_name': restaurant['name'],
        'place_id': restaurant['place_id'],
        'rating': restaurant.get('rating'),
        'vicinity': restaurant.get('vicinity'),
        'photo_urls': photo_urls,
        'photo_count': len(photo_urls)
    }

    # Add to data and save immediately
    all_restaurants_data.append(restaurant_data)
    save_restaurant_data(all_restaurants_data)
    processed_count += 1

    print(f"   ✓ Saved to JSON file")

    # Print photo URLs for this restaurant
    if photo_urls:
        print(f"   Photo URLs ({len(photo_urls)} photos):")
        for j, url in enumerate(photo_urls[:5], 1):  # Show first 5 URLs
            print(f"     {j}. {url}")
        if len(photo_urls) > 5:
            print(f"     ... and {len(photo_urls) - 5} more photos")

    # Add delay between requests to avoid rate limiting
    if i < len(restaurants):
        time.sleep(2)

# Generate summary from saved JSON file
print(f"\nGenerating summary file...")
saved_data = load_existing_data()

# Generate summary filename with same pattern
summary_filename = output_filename.replace('.json', '_summary.txt')
summary_file = os.path.join(outputs_dir, summary_filename)

with open(summary_file, 'w', encoding='utf-8') as f:
    f.write(
        f"Restaurant Photos URL Summary - Coordinates: ({latitude}, {longitude})\n")
    f.write("=" * 50 + "\n\n")

    total_photos = 0
    for restaurant_data in saved_data:
        total_photos += restaurant_data['photo_count']
        f.write(f"Restaurant: {restaurant_data['restaurant_name']}\n")
        f.write(f"Place ID: {restaurant_data['place_id']}\n")
        f.write(f"Rating: {restaurant_data.get('rating', 'N/A')}\n")
        f.write(f"Address: {restaurant_data.get('vicinity', 'N/A')}\n")
        f.write(f"Photo count: {restaurant_data['photo_count']}\n")
        f.write("Photo URLs:\n")

        for j, url in enumerate(restaurant_data['photo_urls'], 1):
            f.write(f"  {j}. {url}\n")

        f.write("\n" + "-" * 50 + "\n\n")

    f.write(f"Total: {len(saved_data)} restaurants, {total_photos} photos")

# Print final summary
print(f"\n" + "=" * 80)
print(f"Run statistics:")
print(f"  - Newly processed: {processed_count} restaurants")
print(f"  - Skipped: {skipped_count} restaurants")
print(f"Total data: {len(saved_data)} restaurants")
total_photos = sum(data['photo_count'] for data in saved_data)
print(f"Total photos: {total_photos}")
print(f"Results saved to:")
print(f"  - JSON format: {output_file}")
print(f"  - Text summary: {summary_file}")
