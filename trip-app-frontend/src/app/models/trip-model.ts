export interface Trip {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  locationLabel: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  capacity: number;
  isPaid: boolean;
  price: number;
  imageUrl: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
}
