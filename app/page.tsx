import { DashboardClient } from "@/components/DashboardClient";
import { dailyPlan, projects, prompts, videos, workflows } from "@/lib/content";

export default function HomePage() {
  return <DashboardClient dailyPlan={dailyPlan} prompts={prompts} projects={projects} videos={videos} workflows={workflows} />;
}
