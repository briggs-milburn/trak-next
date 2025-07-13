import AuthenticatedPage from "./components/AuthenticatedPage";
import DashboardPage from "./trak/dashboard/page";

export const runtime = "edge";

export default function Home() {
  return (
    <AuthenticatedPage>
      <DashboardPage />
    </AuthenticatedPage>
  );
}
