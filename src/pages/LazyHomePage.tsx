import { lazy } from 'react';

const LazyHomePage: React.FC = lazy(() => import('./HomePage.tsx'));
export default LazyHomePage;
