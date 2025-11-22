## Getting Started

Welcome to the VS Code Java world. Here is a guideline to help you get started to write Java code in Visual Studio Code.

## Folder Structure

The workspace contains two folders by default, where:

- `src`: the folder to maintain sources
- `lib`: the folder to maintain dependencies

Meanwhile, the compiled output files will be generated in the `bin` folder by default.

> If you want to customize the folder structure, open `.vscode/settings.json` and update the related settings there.

## Dependency Management

The `JAVA PROJECTS` view allows you to manage your dependencies. More details can be found [here](https://github.com/microsoft/vscode-java-dependency#manage-dependencies).

## Stuff about tomcat (this part by Eli)

To serve servlets, tomcat needs a directory that contains `<CONTEXT_ROOT>/WEB-INF/classes`. That classes directory contains the compiled servlet .class files. It will then serve the application at `http://localhost:8080/<CONTEXT_ROOT>/`

If you're running linux, tomcat will search for these directories containing web apps in `/usr/share/tomcat10/webapps`.

So I've just been directly compiling the source java files there with `javac -d /usr/share/tomcat10/webapps/FoodTracker/WEB-INF/classes -cp /usr/share/java/tomcat10/servlet-api.jar src/*.java`.

The `-d <directory>` tells javac where to put the compiled .class folders, `-cp path/to/something.jar` adds this jar file to the classpath, and `src/*.java` is the source code to compile.

### How to set up Eclipse to compile to the right place and make everything work:

1. Open this repo with File > Open Projects from File System and select the path to the cloned repo.
2. Default options here were fine for me. Add project to working sets is unchecked.
3. Click finish. Now the project is opened but Eclipse doesn't know what to do yet. You have to set up "Project Facets" to tell it what to do.
4. In Project > Properties > ProjectFacets you need to click "Convert to faceted form..."
5. Check the box next to "Dynamic Web Module". "Java" was already checked for me.
6. When you check this box, it says "Further configuration available...". Click this.
7. Set Context root to be `FoodTracker`. This is just the path that it will serve the app under (e.g. `http://localhost:8080/FoodTracker`)
8. Set Content directory to just be `web`. This tell it to create the tomcat directory directly under our repo root and call it `web`. The name doesn't really matter I guess.
9. I just left "Generate web.xml deployment descriptor" unchecked. Idk what it does and I don't see a need for it.
10. Then hit Apply and Close to finish converting the project to a facted form.
11. Now you should be able to right click and "Run on Server". You'll need to have set up a tomcat server in eclipse and select it. Lmk if anyone wants me to add a bit on how to set up the server.
