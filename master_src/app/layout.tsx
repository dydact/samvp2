"use client"

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { Button } from "../components/ui/elements/button"
import { MessageSquare, LogOut, Settings, User as UserIcon, ChevronDown, MessageCircle, AlertCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/elements/popover"
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, GradientAvatar } from '../components/ui/UserIcon/Avatar';
import Footer from '../components/ui/elements/Footer';
import AuthModal from '../components/auth/AuthModal';
import UserMenu from '../components/UserMenu';
import { Layout, Menu } from 'antd';
import Notifications from '../components/Notifications';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import TaskAssignment from '../components/TaskAssignment';
import TaskRLogo from '../components/TaskRLogo';
import TaskR from '../components/TaskR';
import UserProfile from '../components/UserProfile';
import Calendar from '../components/Calendar';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard'; // Assuming you have a Dashboard component
import UserAvatarDropdown from '../components/UserAvatarDropdown';
import { signUp, signIn } from 'aws-amplify/auth';

const { Header, Content, Footer: AntFooter } = Layout;

const client = generateClient<Schema>();

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #6200ea; // Deeper purple
    --primary-dark: #3700b3;
    --background: #f5f5f5; // Light gray background
    --background-light: #ffffff;
    --text: #333333;
    --text-muted: #666666;
    --border: #e0e0e0;
    --accent: #bb86fc; // Light purple accent
    --header-bg: #1a1a1a; // Dark steel color for header
    --siteaware-text: #e0e0e0; // Bright gray for SiteAware text
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background);
    color: var(--text);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .chat-card {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 300px;
    height: 400px;
    background-color: var(--background-light);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .chat-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .chat-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .chat-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s ease;
    &:hover {
      color: var(--text);
    }
  }

  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .chat-input {
    border: none;
    border-top: 1px solid var(--border);
    background-color: var(--background);
    color: var(--text);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    &::placeholder {
      color: var(--text-muted);
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    nav {
      margin-top: 1rem;
      flex-wrap: wrap;
    }
  }

  .animate-fade-in {
    animation: ${fadeIn} 0.3s ease-in;
  }
`;

// Styled components for layout
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const StyledHeader = styled(Header)`
  background-color: var(--header-bg);
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  height: 60px; // Reduced height
  line-height: 60px; // Ensure vertical centering
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatButton = styled(Button)`
  position: relative;
`;

const NotificationDot = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
`;

const SiteTitle = styled(Link)`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--siteaware-text);
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  text-decoration: none;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
`;

const PoweredBy = styled.span`
  font-size: 0.6rem;
  font-weight: bold;
  color: var(--text-muted);
  margin-top: 0.1rem;
  line-height: 1; // Ensure it doesn't add extra height
`;

const DydactLink = styled.a`
  color: var(--accent);
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem; // Reduced gap
  height: 100%;
`;

const NavLink = styled(RouterNavLink)`
  color: var(--background-light);
  text-decoration: none;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  padding: 0.3rem 0.5rem;
  border-radius: 0.25rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before, &.active::before {
    opacity: 1;
  }

  &:hover, &.active {
    color: var(--accent);
  }
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 250px; // This should match the sidebar width
  overflow-y: auto;
`;

const AvatarButton = styled(Button)`
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  width: 32px; // Reduced size
  height: 32px; // Reduced size
`;

const ProfileDropdown = styled.div`
  background-color: var(--background-light);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  width: 200px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const ProfileInfo = styled.div`
  margin-left: 1rem;
`;

const ProfileName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const ProfileEmail = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
`;

const ProfileMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProfileMenuItem = styled.li`
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProfileMenuButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  padding: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Tabs = styled.div`
  margin-bottom: 2rem;
`;

const TabsList = styled.div`
  background-color: var(--background-light);
  border-radius: 0.5rem;
  padding: 0.25rem;
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.active && css`
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text);
  `}
`;

const Sidebar = styled.nav`
  background-color: var(--background-light);
  width: 250px;
  padding: 1rem 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  z-index: 999;
`;

const SidebarItem = styled(Link)<{ $active: boolean }>`
  display: block;
  color: var(--text);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;

  &:hover, &.active {
    background-color: var(--accent);
    color: var(--background-light);
    border-left-color: var(--primary);
  }

  ${props => props.$active && css`
    background-color: var(--accent);
    color: var(--background-light);
    border-left-color: var(--primary);
  `}
`;

// Update the TaskRText component to be more versatile
const TaskRText = styled.span<{ $inChat?: boolean }>`
  font-style: normal;
  .r {
    color: red;
    font-weight: bold;
    font-style: italic;
  }
  ${props => props.$inChat && css`
    font-size: 0.9rem;
  `}
`;

// Update the ChatCard component definition
const ChatCard = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 0.5rem;
  overflow: hidden;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
`;

// Update the ChatTabs and ChatTab components for better visibility
const ChatTabs = styled.div`
  display: flex;
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
`;

const ChatTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  ${props => props.$active && css`
    background-color: var(--background-light);
    border-bottom: 2px solid var(--primary);
    font-weight: bold;
  `}

  &:hover {
    background-color: ${props => props.$active ? 'var(--background-light)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const NotificationBadge = styled.span`
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const TaskRCapsule = styled.div<{ $isActive: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--header-bg);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: ${props => props.$isActive ? 'scale(1.05)' : 'scale(1)'};

  &:hover {
    transform: scale(1.1);
  }

  .task {
    font-size: 1rem;
    font-weight: bold;
  }

  .r {
    color: ${props => props.$isActive ? 'var(--accent)' : 'red'};
    font-weight: bold;
    font-style: italic;
    margin-left: 2px;
    transition: color 0.3s ease;
  }

  .icon {
    margin-left: 5px;
    width: 24px;
    height: 24px;
    background-color: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const GrayedOutNavLink = styled(NavLink)`
  color: var(--text-muted);
  pointer-events: none;
  opacity: 0.5;
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export interface RootLayoutProps {
  children: React.ReactNode;
  handleSignOut: () => Promise<void>;
  setShowAuthPopup: () => void;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children, handleSignOut, setShowAuthPopup }) => {
  const { isSignedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState('chat');
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const location = useLocation(); // Import useLocation from react-router-dom

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { data } = await client.models.Task.list({
          filter: { status: { eq: 'PENDING' } },
        });
        setNotificationCount(data.length);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
  }, []);

  const handleAuthClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleAuth = async (username: string, password: string, isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await signUp({ username, password }); // Corrected to pass an object
      } else {
        await signIn({ username, password }); // Corrected to pass an object
      }
      setShowAuthModal(false);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const siteAwareComponents = [
    'Video Analysis',
    'Activity Recognition',
    'Anomaly Detection',
    'Patient Monitoring',
    'Treatment Plans',
    'Data Analytics',
    'Alerts & Notifications',
    'Privacy & Security'
  ];

  const logoRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const adjustSidebarWidth = () => {
      if (logoRef.current && sidebarRef.current) {
        const logoWidth = logoRef.current.offsetWidth;
        sidebarRef.current.style.width = `${logoWidth}px`;
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.marginLeft = `${logoWidth}px`;
        }
      }
    };

    adjustSidebarWidth();
    window.addEventListener('resize', adjustSidebarWidth);

    return () => {
      window.removeEventListener('resize', adjustSidebarWidth);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['all'] },
    { name: 'Clients', path: '/clients', roles: ['admin', 'manager', 'staff'] },
    { name: 'Finance', path: '/finance', roles: ['admin', 'manager'] },
    { name: 'Analytics', path: '/analytics', roles: ['admin', 'manager'] },
    { name: 'Personnel', path: '/personnel', roles: ['admin', 'manager'] },
    { name: 'TaskR', path: '/taskr', roles: ['all'] },
    { name: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes('all') || (user && item.roles.includes(user.role))
  );

  return (
    <>
      <GlobalStyle />
      <LayoutWrapper>
        <StyledHeader>
          <Container>
            <HeaderContent>
              <NavContainer>
                <NavLeft>
                  <SiteTitle to="/">
                    SiteAware
                    <PoweredBy>
                      powered by <DydactLink href="https://dydact.io" target="_blank" rel="noopener noreferrer">dydact LLMs</DydactLink>
                    </PoweredBy>
                  </SiteTitle>
                </NavLeft>
                <NavRight>
                  <ChatButton variant="ghost" size="icon" onClick={() => setIsChatVisible(!isChatVisible)}>
                    <MessageSquare className="h-4 w-4" />
                    {hasNotifications && <NotificationDot />}
                  </ChatButton>
                  <UserAvatarDropdown />
                </NavRight>
              </NavContainer>
            </HeaderContent>
          </Container>
        </StyledHeader>

        <ContentWrapper>
          <Sidebar>
            {filteredNavItems.map(item => (
              <SidebarItem
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.name === 'TaskR' ? <TaskRLogo /> : item.name}
              </SidebarItem>
            ))}
          </Sidebar>

          <Main>
            <Container>
              {children}
            </Container>
          </Main>
        </ContentWrapper>

        <Footer 
          isSignedIn={isSignedIn}
          onSignIn={handleAuthClick}
          onSignUp={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
        />
      </LayoutWrapper>
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      )}

      {/* Updated Chat Card usage */}
      <ChatCard $isVisible={isChatVisible}>
        <div className="chat-content">
          <div className="chat-header">
            <ChatTabs>
              <ChatTab $active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>Notifications</ChatTab>
              <ChatTab $active={activeTab === 'taskr'} onClick={() => setActiveTab('taskr')}>
                <TaskRText $inChat>task<span className="r">R</span></TaskRText>
              </ChatTab>
            </ChatTabs>
            <button className="chat-close" onClick={() => setIsChatVisible(false)}>&times;</button>
          </div>
          <div className="chat-messages">
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'taskr' && <TaskAssignment onAssignmentComplete={() => {
              console.log('Task assignment completed');
              // You might want to refresh the task list or update some state
            }} />}
          </div>
        </div>
      </ChatCard>
      <TaskRCapsule $isActive={isChatVisible} onClick={() => setIsChatVisible(!isChatVisible)}>
        <span className="task">task</span>
        <span className="r">R</span>
        <div className="icon">
          <MessageCircle size={16} />
        </div>
      </TaskRCapsule>
    </>
  );
};

export default RootLayout;