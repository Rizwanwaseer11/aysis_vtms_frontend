
import './App.css'

function App() {
 

  return (
    <>
<header className="bg-gray-900">
  <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
    <div className="flex lg:flex-1">
      <a href="#" className="-m-1.5 p-1.5">
        <span className="sr-only">Your Company</span>
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt className="h-8 w-auto" />
      </a>
    </div>
    <el-popover-group className="hidden lg:flex lg:gap-x-12">
      
      <a href="#" className="text-sm/6 font-semibold text-white">Features</a>
      <a href="#" className="text-sm/6 font-semibold text-white">Marketplace</a>
      <a href="#" className="text-sm/6 font-semibold text-white">Company</a>
    </el-popover-group>
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="#" className="text-sm/6 font-semibold text-white">Log in <span aria-hidden="true">→</span></a>
    </div>
  </nav>
  
</header>

    <h1>farha waseer</h1>

    </>
  )
}

export default App
