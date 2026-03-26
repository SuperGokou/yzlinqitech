INSERT INTO public.site_content (section, key, value_zh, value_en, type) VALUES
  ('hero', 'project_count', '50', '50', 'number'),
  ('hero', 'satisfaction_rate', '99', '99', 'number'),
  ('hero', 'response_time', '24', '24', 'number'),
  ('hero', 'employee_count', '15', '15', 'number'),
  ('social', 'github_url', NULL, NULL, 'url'),
  ('social', 'twitter_url', NULL, NULL, 'url'),
  ('social', 'wechat_qr_image', NULL, NULL, 'image'),
  ('footer', 'company_email', 'contact@lingqitech.com', 'contact@lingqitech.com', 'text'),
  ('footer', 'company_location', '中国 上海', 'Shanghai, China', 'text'),
  ('footer', 'company_phone', NULL, NULL, 'text'),
  ('general', 'site_title', '软件加工厂', 'LingQi Tech', 'text'),
  ('general', 'site_description', '纯AI驱动的软件开发公司', 'AI-Driven Software Development', 'text');

INSERT INTO public.services (title_zh, title_en, slug, description_zh, description_en, icon, tags, is_active, sort_order) VALUES
  ('网站开发', 'Web Development', 'web-development', '企业官网、电商平台、SaaS应用', 'Corporate sites, e-commerce, SaaS apps', 'Globe', ARRAY['React','Next.js','Vue'], true, 1),
  ('小程序开发', 'Mini Programs', 'mini-programs', '微信、支付宝、抖音小程序', 'WeChat, Alipay, Douyin mini programs', 'Smartphone', ARRAY['WeChat','Alipay','Douyin'], true, 2),
  ('游戏开发', 'Game Development', 'game-development', '2D/3D游戏、Unity开发', '2D/3D games, Unity development', 'Gamepad2', ARRAY['Unity','C#','3D'], true, 3),
  ('AI定制', 'AI Custom', 'ai-custom', 'AI聊天机器人、RAG系统', 'AI chatbots, RAG systems', 'Bot', ARRAY['AI','NLP','RAG'], true, 4),
  ('工业软件', 'Industrial Software', 'industrial-software', 'MES、ERP、SCADA系统', 'MES, ERP, SCADA systems', 'Factory', ARRAY['MES','ERP','SCADA'], true, 5),
  ('UI/UX设计', 'UI/UX Design', 'ui-ux-design', '界面设计、用户体验优化', 'Interface design, UX optimization', 'Palette', ARRAY['Figma','UI','UX'], true, 6),
  ('数据可视化', 'Data Visualization', 'data-visualization', '数据大屏、报表系统', 'Data dashboards, reporting systems', 'BarChart3', ARRAY['D3.js','ECharts'], true, 7),
  ('移动应用', 'Mobile Development', 'mobile-development', 'iOS/Android原生及跨平台', 'iOS/Android native and cross-platform', 'Smartphone', ARRAY['React Native','Flutter'], true, 8);
