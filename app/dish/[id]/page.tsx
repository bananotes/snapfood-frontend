import DishDetailPage from '../../../components/DishDetailPage';

interface DishDetailPageProps {
  params: {
    id: string;
  };
}

export default function DishDetailRoute({ params }: DishDetailPageProps) {
  return <DishDetailPage dishId={params.id} />;
}
