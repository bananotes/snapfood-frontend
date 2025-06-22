import json
import requests
import time
import os
import glob
from typing import Dict, List, Optional

# Configuration
DIFY_TOKEN = "XXXXXXXXXXXXX"
DIFY_WORKFLOW_URL = "https://api.dify.ai/v1/workflows/run"

# Automatically load all JSON files from outputs directory
OUTPUT_DIR = "outputs"
INPUT_FILES = glob.glob(os.path.join(OUTPUT_DIR, "*.json"))

print(f"Found {len(INPUT_FILES)} JSON files in {OUTPUT_DIR} directory:")
for file in INPUT_FILES:
    print(f"  - {file}")

# Configuration for knowledge base
KNOWLEDGE_BASE_DIR = "knowledge_base"
PROCESSED_PLACES_FILE = "processed_places.json"
BATCH_SIZE = 100  # Save every 100 dishes


def load_processed_places() -> List[str]:
    """
    Load list of already processed place IDs
    """
    if os.path.exists(PROCESSED_PLACES_FILE):
        try:
            with open(PROCESSED_PLACES_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []


def save_processed_place(place_id: str):
    """
    Add a place ID to the processed list and save
    """
    processed_places = load_processed_places()
    if place_id not in processed_places:
        processed_places.append(place_id)
        with open(PROCESSED_PLACES_FILE, 'w', encoding='utf-8') as f:
            json.dump(processed_places, f, ensure_ascii=False, indent=2)


def save_knowledge_base_batch(dishes: List[Dict], batch_number: int):
    """
    Save a batch of dishes to knowledge base JSON file
    """
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        os.makedirs(KNOWLEDGE_BASE_DIR)

    filename = f"knowledge_base_batch_{batch_number:03d}.json"
    filepath = os.path.join(KNOWLEDGE_BASE_DIR, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(dishes, f, ensure_ascii=False, indent=2)

    print(
        f"    Saved knowledge base batch {batch_number} ({len(dishes)} dishes) to {filename}")


def call_dify_workflow(image_url: str) -> Optional[Dict]:
    """
    Call Dify workflow to analyze image and return dish information
    """
    try:
        headers = {
            "Authorization": f"Bearer {DIFY_TOKEN}",
            "Content-Type": "application/json"
        }

        payload = {
            "inputs": {
                "image": {
                    "url": image_url,
                    "transfer_method": "remote_url",
                    "type": "image",
                }
            },
            "response_mode": "blocking",
            "user": "image-analyzer"
        }

        print(f"Analyzing image: {image_url[:80]}...")
        response = requests.post(
            DIFY_WORKFLOW_URL, headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            outputs = result.get('data', {}).get('outputs', {})

            return {
                'is_a_dish': outputs.get('is_a_dish', 0),
                'name': outputs.get('name', ''),
                'desc': outputs.get('desc', '')
            }
        else:
            print(
                f"Error calling Dify workflow: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        print(f"Exception calling Dify workflow: {e}")
        return None


def generate_mongodb_insert(restaurant_name: str, place_id: str, photo_url: str,
                            dish_name: str, description: str) -> str:
    """
    Generate MongoDB insert command for a dish
    """
    insert_command = f'''db.dishes.insertOne({{
    "dish_name": "{dish_name.replace('"', '\\"')}",
    "description": "{description.replace('"', '\\"')}",
    "photo_url": "{photo_url}",
    "place_id": "{place_id}",
    "restaurant_name": "{restaurant_name.replace('"', '\\"')}",
    "created_at": new Date(),
    "verified": false
}});'''

    return insert_command


def process_restaurant_photos():
    """
    Main function to process restaurant photos and generate MongoDB insert commands
    """
    if not INPUT_FILES:
        print(f"No JSON files found in {OUTPUT_DIR} directory!")
        return

    # Load processed places for resume functionality
    processed_places = load_processed_places()
    print(f"Loaded {len(processed_places)} already processed places")

    # Prepare output files
    mongodb_commands = []
    analysis_results = []
    knowledge_base_dishes = []
    current_batch = 1
    total_kb_dishes = 0

    total_photos = 0
    total_dishes = 0
    total_non_dishes = 0
    total_restaurants = 0
    skipped_restaurants = 0

    print(f"Processing {len(INPUT_FILES)} input files...")

    for file_index, input_file in enumerate(INPUT_FILES, 1):
        print(f"\n{'='*60}")
        print(
            f"Processing file {file_index}/{len(INPUT_FILES)}: {os.path.basename(input_file)}")
        print(f"{'='*60}")

        try:
            # Load restaurant data
            with open(input_file, 'r', encoding='utf-8') as f:
                restaurants_data = json.load(f)

            print(
                f"Found {len(restaurants_data)} restaurants in {os.path.basename(input_file)}")

            for restaurant in restaurants_data:
                restaurant_name = restaurant['restaurant_name']
                place_id = restaurant['place_id']
                photo_urls = restaurant['photo_urls']
                total_restaurants += 1

                # Check if this place has already been processed
                if place_id in processed_places:
                    print(f"\nSkipping {restaurant_name} (already processed)")
                    skipped_restaurants += 1
                    continue

                print(
                    f"\nProcessing {restaurant_name} ({len(photo_urls)} photos)...")

                restaurant_dishes_found = 0

                for i, photo_url in enumerate(photo_urls, 1):
                    total_photos += 1
                    print(f"  Photo {i}/{len(photo_urls)}")

                    # Call Dify workflow to analyze the image
                    analysis = call_dify_workflow(photo_url)

                    if analysis is None:
                        print(f"    Failed to analyze image")
                        continue

                    # Store analysis result
                    analysis_result = {
                        'restaurant_name': restaurant_name,
                        'place_id': place_id,
                        'photo_url': photo_url,
                        'analysis': analysis
                    }
                    analysis_results.append(analysis_result)

                    # Check if it's identified as a dish (is_a_dish == 1)
                    if analysis.get('is_a_dish') == 1 and analysis.get('name'):
                        dish_name = analysis['name']
                        description = analysis.get('desc', '')

                        # Generate MongoDB command
                        mongodb_command = generate_mongodb_insert(
                            restaurant_name, place_id, photo_url, dish_name, description
                        )
                        mongodb_commands.append(mongodb_command)

                        # Add to knowledge base
                        knowledge_base_entry = {
                            'restaurant_name': restaurant_name,
                            'place_id': place_id,
                            'photo_url': photo_url,
                            'dish_name': dish_name,
                            'description': description
                        }
                        knowledge_base_dishes.append(knowledge_base_entry)

                        total_dishes += 1
                        total_kb_dishes += 1
                        restaurant_dishes_found += 1

                        print(f"    ✓ Dish identified: {dish_name}")

                        # Save knowledge base batch when reaching batch size
                        if len(knowledge_base_dishes) >= BATCH_SIZE:
                            save_knowledge_base_batch(
                                knowledge_base_dishes, current_batch)
                            knowledge_base_dishes = []  # Clear for next batch
                            current_batch += 1

                    else:
                        total_non_dishes += 1
                        if analysis.get('is_a_dish') == 0:
                            print(f"    - Not a dish (is_a_dish=0), skipping")
                        elif not analysis.get('name'):
                            print(f"    - No dish name provided, skipping")
                        else:
                            print(
                                f"    - Invalid is_a_dish value: {analysis.get('is_a_dish')}, skipping")

                    # Add delay to avoid rate limiting
                    time.sleep(0.8)

                # Mark this place as processed after completing all photos
                save_processed_place(place_id)
                print(
                    f"  ✓ Completed {restaurant_name} - Found {restaurant_dishes_found} dishes")

        except FileNotFoundError:
            print(f"Error: Input file '{input_file}' not found")
            continue
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in input file '{input_file}'")
            continue
        except Exception as e:
            print(f"Error processing file '{input_file}': {e}")
            continue

    # Save remaining knowledge base dishes if any
    if knowledge_base_dishes:
        save_knowledge_base_batch(knowledge_base_dishes, current_batch)

    # Save MongoDB commands to file
    with open('mongodb_insert_commands.js', 'w', encoding='utf-8') as f:
        f.write("// MongoDB insert commands for dishes\n")
        f.write("// Generated from restaurant photo analysis\n\n")
        f.write("use restaurant_db;\n\n")

        for command in mongodb_commands:
            f.write(command + "\n\n")

    # Save detailed analysis results
    with open('photo_analysis_results.json', 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, ensure_ascii=False, indent=2)

    # Generate summary report
    with open('analysis_summary.txt', 'w', encoding='utf-8') as f:
        f.write("Photo Analysis Summary\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Total input files processed: {len(INPUT_FILES)}\n")
        f.write("Input files:\n")
        for file in INPUT_FILES:
            f.write(f"  - {os.path.basename(file)}\n")
        f.write(f"\nTotal restaurants found: {total_restaurants}\n")
        f.write(
            f"Restaurants skipped (already processed): {skipped_restaurants}\n")
        f.write(f"Total photos analyzed: {total_photos}\n")
        f.write(f"Total dishes identified: {total_dishes}\n")
        f.write(f"Total non-dishes: {total_non_dishes}\n")
        f.write(
            f"Dish identification rate: {(total_dishes/total_photos*100):.1f}%\n")
        f.write(f"Knowledge base batches created: {current_batch}\n")
        f.write(f"Total knowledge base entries: {total_kb_dishes}\n\n")

        f.write("Dishes by restaurant:\n")
        f.write("-" * 30 + "\n")

        restaurant_dish_counts = {}
        for result in analysis_results:
            if result['analysis'].get('is_a_dish') == 1:
                restaurant_name = result['restaurant_name']
                restaurant_dish_counts[restaurant_name] = restaurant_dish_counts.get(
                    restaurant_name, 0) + 1

        for restaurant_name, count in restaurant_dish_counts.items():
            f.write(f"{restaurant_name}: {count} dishes\n")

    print(f"\n" + "=" * 60)
    print(f"Processing complete!")
    print(
        f"Total restaurants processed: {total_restaurants - skipped_restaurants}")
    print(f"Total restaurants skipped: {skipped_restaurants}")
    print(f"Total photos analyzed: {total_photos}")
    print(f"Total dishes identified: {total_dishes}")
    print(f"Total non-dishes skipped: {total_non_dishes}")
    print(f"Knowledge base batches created: {current_batch}")
    print(f"Files generated:")
    print(f"  - mongodb_insert_commands.js (MongoDB commands)")
    print(f"  - photo_analysis_results.json (Detailed results)")
    print(f"  - analysis_summary.txt (Summary report)")
    print(f"  - {KNOWLEDGE_BASE_DIR}/ (Knowledge base batches)")
    print(f"  - {PROCESSED_PLACES_FILE} (Resume checkpoint)")


if __name__ == "__main__":
    process_restaurant_photos()
