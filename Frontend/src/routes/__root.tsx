import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/templates/Layout/Layout';

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});