import 'dotenv/config'
import 'reflect-metadata'
import App from './app'
import * as C from './controllers'
import * as S from './services'
import * as M from './models'
import * as H from './helpers'
import * as R from './repositories'

const app = new App([
  new C.AuthenticationController(
    new S.AuthenticationService(
      new R.UserRepository(M.UserModel),
      new R.UserSettingsRepository(M.UserSettingsModel)
    )
  ),

  new C.FilamentController(
    new S.FilamentService(
      new R.FilamentRepository(M.FilamentModel),
      new R.RollRepository(M.RollModel)
    )
  ),

  new C.RollController(
    new S.RollService(
      new R.RollRepository(M.RollModel)
    ),
  ),

  new C.OrderController(
    new S.OrderService(
      new R.OrderRepository(M.OrderModel),
      new R.UserSettingsRepository(M.UserSettingsModel),
      new H.DTOHelper()
    )
  ),

  new C.UserController(
    new S.UserService(
      new R.UserRepository(M.UserModel),
      new R.UserSettingsRepository(M.UserSettingsModel),
      new R.FilamentRepository(M.FilamentModel),
      new R.RollRepository(M.RollModel),
      new R.OrderRepository(M.OrderModel),
      new R.ProjectRepository(M.ProjectModel),
      new H.AWSS3Helper(),
      new H.DTOHelper()
    )
  ),

  new C.ProjectController(
    new S.ProjectService(
      new R.ProjectRepository(M.ProjectModel),
      new H.AWSS3Helper()
    )
  ),

  new C.UserSettingsController(
    new S.UserSettingsService(
      new R.UserSettingsRepository(M.UserSettingsModel),
      new H.DTOHelper()
    )
  )
])

app.listen()