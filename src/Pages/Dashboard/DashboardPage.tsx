import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">goFinanceX Dashboard</h1>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="p-6 bg-white rounded">
            <h2 className="text-xl mb-4">Welcome to your Dashboard</h2>
            <p>{`This is where you'll see your financial overview and budget management tools.`}</p>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
