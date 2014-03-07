package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index(clientRoute: String) = Action {
    Ok(views.html.index())
  }

  def redirect = Action {
    Redirect("/dynamic/")
  }

}
