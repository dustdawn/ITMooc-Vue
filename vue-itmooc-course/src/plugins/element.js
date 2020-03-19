import Vue from 'vue'
// import { Button } from 'element-ui'
// 添加element ui的样式组件
// import { Button, Form, FormItem, Input, Message, Container, Header } from 'element-ui'
import Element from 'element-ui'

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

Vue.use(Element)
// 使用 Vue.use(Message)会自动弹出
// Vue.component(Message)
// 全局挂载message到vue的原型对象
Vue.prototype.$message = Element.Message
Vue.prototype.$confirm = Element.MessageBox
