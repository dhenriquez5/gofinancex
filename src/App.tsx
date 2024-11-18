import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { DashboardOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="h-8 m-4 bg-white/10" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            Budget
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white p-0">
          <h1 className="text-2xl font-bold p-4">goFinanceX</h1>
        </Header>
        <Content className="m-6 p-6 bg-white">
          <h2 className="text-xl mb-4">Welcome to goFinanceX</h2>
          <p className="mb-4">Your personal budget management solution.</p>
          <Button type="primary">Get Started</Button>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
