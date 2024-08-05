import { useQuery } from '@tanstack/react-query';
import { getBaseUrl } from '@/api/instance';
import { useAuth } from '@/provider/Auth';

interface PointsResponse {
  point: number;
}

const fetchMemberPoints = async (token: string): Promise<number> => {
  const response = await fetch(`${getBaseUrl()}/api/points`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch member points');
  }

  const data: PointsResponse = await response.json();
  return data.point;
};

export const useGetMemberPoints = () => {
  const authInfo = useAuth();

  return useQuery({
    queryKey: ['memberPoints'],
    queryFn: () => fetchMemberPoints(authInfo?.token ?? ''),
    enabled: !!authInfo?.token,
  });
};