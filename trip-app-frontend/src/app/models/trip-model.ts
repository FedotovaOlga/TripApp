export interface Trip {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  locationLabel: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  capacity: number;
  isPaid: boolean;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
}
