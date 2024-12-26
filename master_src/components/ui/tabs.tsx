import React from 'react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from 'antd';

export const Tabs = (props: AntTabsProps) => <AntTabs {...props} />;
export const TabsContent = AntTabs.TabPane;
export const TabsList = AntTabs.TabPane;
export const TabsTrigger = AntTabs.TabPane;