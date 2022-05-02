import { IControllerBase } from "../../interfaces"

export default (controllers: Array<IControllerBase>): void => {
  controllers.forEach(controller => {
    if (controller.router.stack.length === 0) {
      console.log(`${controller.constructor.name} → no routes.`)
      return
    }

    controller.router.stack.map(stackItem => {
      const { path, methods } = stackItem.route
      const _methods = Object.keys(methods).filter(k => k !== '_all')
      const _prefix = '/api'

      _methods.forEach(method => {
        console.log(`${controller.constructor.name} → ${method.toUpperCase()} → ${_prefix}${path}`)
      })
    })
  })
} 