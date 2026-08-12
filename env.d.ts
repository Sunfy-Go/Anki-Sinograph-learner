/// <reference types="vite/client" />

declare module '*.svg?component' {
  import type { DefineComponent, ComponentOptions } from 'vue'
  const component: DefineComponent<{}, {}, any> | ComponentOptions
  export default component
}

// Khai báo cho file SVG thông thường (nếu cần)
declare module '*.svg' {
  const content: string
  export default content
}