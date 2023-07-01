import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'vant/lib/index.css';
import router from './router.js';
import { Button } from 'vant';
import { Tabbar, TabbarItem } from 'vant';
import { ConfigProvider } from 'vant';
import { NavBar } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Toast } from 'vant';
import { Tag } from 'vant';
import { Icon } from 'vant';
import { Popover } from 'vant';
import { Form, Field } from 'vant';
import { Dialog } from 'vant';
import { ActionSheet } from 'vant';
import { List } from 'vant';
import { Watermark } from 'vant';
import { DatePicker } from 'vant';
import { Picker } from 'vant';
import { Popup } from 'vant';

const app = createApp(App);
app.use(router);
app.use(Button);
app.use(Tabbar);
app.use(TabbarItem);
app.use(ConfigProvider);
app.use(NavBar);
app.use(Cell);
app.use(CellGroup);
app.use(Toast);
app.use(Popover);
app.use(Tag);
app.use(Icon);
app.use(Form);
app.use(Field);
app.use(Dialog);
app.use(ActionSheet);
app.use(List);
app.use(Watermark);
app.use(DatePicker);
app.use(Picker);
app.use(Popup);
app.mount('#app');
