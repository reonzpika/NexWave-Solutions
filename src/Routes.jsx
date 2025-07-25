import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import ImageAnalyzer from "pages/image-analyzer";
import ContextAwareClinicalAssistant from "pages/context-aware-clinical-assistant";
import TemplateManagement from "pages/template-management";
import AiScribeConsultation from "pages/ai-scribe-consultation";
import SessionManagement from "pages/session-management";
import UserAnalyticsDashboard from "pages/user-analytics-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/image-analyzer" element={<ImageAnalyzer />} />
        <Route path="/context-aware-clinical-assistant" element={<ContextAwareClinicalAssistant />} />
        <Route path="/template-management" element={<TemplateManagement />} />
        <Route path="/ai-scribe-consultation" element={<AiScribeConsultation />} />
        <Route path="/session-management" element={<SessionManagement />} />
        <Route path="/user-analytics-dashboard" element={<UserAnalyticsDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;