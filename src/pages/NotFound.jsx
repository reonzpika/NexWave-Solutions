import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularPages = [
    {
      title: 'Dashboard',
      description: 'Overview and quick actions',
      path: '/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      title: 'AI Scribe Consultation',
      description: 'Voice-to-text consultation recording',
      path: '/ai-scribe-consultation',
      icon: 'Mic'
    },
    {
      title: 'Clinical Assistant',
      description: 'Intelligent clinical search and guidance',
      path: '/context-aware-clinical-assistant',
      icon: 'Stethoscope'
    },
    {
      title: 'Session Management',
      description: 'Active session monitoring',
      path: '/session-management',
      icon: 'Users'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Not Found - ClinicPro</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="FileQuestion" size={48} className="text-primary" />
            </div>
            <h1 className="text-6xl sm:text-8xl font-bold text-muted-foreground/20 mb-4">404</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Page Not Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button 
              onClick={handleGoBack}
              iconName="ArrowLeft"
              iconPosition="left"
              size="lg"
            >
              Go Back
            </Button>
            <Button 
              variant="outline"
              asChild
              size="lg"
            >
              <Link to="/dashboard">
                <Icon name="Home" size={18} className="mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon name={page.icon} size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {page.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {page.description}
                      </p>
                    </div>
                    <Icon 
                      name="ArrowRight" 
                      size={16} 
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a 
                href="mailto:support@clinicpro.co.nz" 
                className="text-primary hover:underline"
              >
                support@clinicpro.co.nz
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;