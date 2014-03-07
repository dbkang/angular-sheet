name := "play-template"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  "org.webjars" %% "webjars-play" % "2.2.1-2",
  "org.webjars" % "angularjs" % "1.2.13",
  "org.webjars" % "angular-ui-bootstrap" % "0.10.0",
  "org.webjars" % "angular-ui-router" % "0.2.8-2"
)

play.Project.playScalaSettings
