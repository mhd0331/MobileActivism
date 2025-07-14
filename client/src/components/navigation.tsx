import { Button } from "@/components/ui/button";
import { Megaphone, PenTool, Lightbulb, FolderOpen, TrendingUp } from "lucide-react";
import { useContentText } from "@/hooks/useWebContent";

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  // Get content from database
  const noticesTab = useContentText("navigation", "notices_tab", "공지사항");
  const signatureTab = useContentText("navigation", "signature_tab", "서명하기");
  const policiesTab = useContentText("navigation", "policies_tab", "정책제안");
  const resourcesTab = useContentText("navigation", "resources_tab", "자료실");
  const dashboardTab = useContentText("navigation", "dashboard_tab", "현황");

  const sections = [
    { id: "notices", label: noticesTab, icon: Megaphone },
    { id: "signature", label: signatureTab, icon: PenTool },
    { id: "policies", label: policiesTab, icon: Lightbulb },
    { id: "resources", label: resourcesTab, icon: FolderOpen },
    { id: "dashboard", label: dashboardTab, icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center sm:justify-start space-x-1 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant="ghost"
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col sm:flex-row items-center justify-center px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-base md:text-lg font-semibold border-b-3 transition-all duration-300 whitespace-nowrap min-w-[70px] sm:min-w-[120px] hover:bg-blue-50 ${
                  currentSection === section.id
                    ? "border-primary text-primary bg-blue-50 shadow-sm"
                    : "border-transparent text-gray-600 hover:text-primary hover:border-primary/30"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-base font-medium leading-tight">{section.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
