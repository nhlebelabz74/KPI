import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import Profitability from "./sections/Profitability";
import Leadership from "./sections/Leadership";
import KnowledgeManagement from "./sections/KnowledgeManagement";
import Teamwork from "./sections/Teamwork";
import FirmDevelopment from "./sections/FirmDevelopment";
import BusinessDevelopment from "./sections/BusinessDevelopment";
import TechnicalSkills from "./sections/TechnicalSkills";

import { useParams } from "react-router-dom";

// import { Skeleton } from "@/components/ui/skeleton"

const CAHomePage = () => {
  let { content } = useParams();

  if (!content) {
    content = "";
  }

  const sections = [
    { id: "profit", component: Profitability },
    { id: "leadership", component: Leadership },
    { id: "knowledge", component: KnowledgeManagement },
    { id: "teamwork", component: Teamwork },
    { id: "firm-dev", component: FirmDevelopment },
    { id: "business", component: BusinessDevelopment },
    { id: "technical", component: TechnicalSkills },
  ];

  return (
    (<SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    KPI's
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Candidate Attorney</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* create components  */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {
            sections.map((section) => {
              if(section.id === content) {
                const SectionComponent = section.component;
                return <SectionComponent key={section.id} />;
              }
            })
          }
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}

export default CAHomePage;