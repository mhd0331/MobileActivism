import { Button } from "@/components/ui/button";
import { Megaphone, PenTool, Lightbulb, FolderOpen, TrendingUp } from "lucide-react";

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const sections = [
    { id: "notices", label: "공지사항", icon: Megaphone },
    { id: "signature", label: "서명 운동", icon: PenTool },
    { id: "policies", label: "정책 제안", icon: Lightbulb },
    { id: "resources", label: "자료실", icon: FolderOpen },
    { id: "dashboard", label: "진행 현황", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant="ghost"
                onClick={() => onSectionChange(section.id)}
                className={`flex items-center px-3 sm:px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  currentSection === section.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.label.split(" ")[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
