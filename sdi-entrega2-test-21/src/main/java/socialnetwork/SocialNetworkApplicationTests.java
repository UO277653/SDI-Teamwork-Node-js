package socialnetwork;

import com.mongodb.MongoException;
import com.mongodb.client.*;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import socialnetwork.pageobjects.*;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.bson.Document;
import socialnetwork.util.*;

import java.util.List;

import static com.mongodb.client.model.Filters.eq;

//Ordenamos las pruebas por la anotación @Order de cada método
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SocialNetworkApplicationTests {
    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";

    // Jonas
    static String Geckodriver = "C:\\Users\\Alejandro\\Desktop\\SDI-2022\\software\\software\\geckodriver-v0.27.0-win64\\geckodriver.exe";

    // Adrian
//    static String Geckodriver = "C:\\Users\\adria\\OneDrive\\Escritorio\\UNIVERSIDAD\\AÑO 3\\SEMESTRE 2\\Sistemas Distribuidos e Internet\\Laboratorio\\Lab5\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";



    //Sara
    //static String Geckodriver = "D:\\UNI\\3º\\2º cuatri\\SDI\\Lab\\sesion05\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Diego
    //static String Geckodriver = "C:\\Users\\dimar\\Desktop\\sdi\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Ari
//    static String Geckodriver = "C:\\Users\\UO270119\\Desktop\\IIS (definitiva)\\3º - Tercero\\Segundo cuatri\\Sistemas Distribuidos e Internet\\Lab\\[materiales]\\5. Selenium\\PL-SDI-Sesión5-material\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    static WebDriver driver = getDriver(PathFirefox, Geckodriver);
    static String URL = "http://localhost:3000";
    static String URI = "mongodb+srv://admin:sdi@socialnetwork.ddcue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    static MongoClient mongoClient;
    static MongoDatabase db;

    static MongoCollection<Document> collection;

    public static WebDriver getDriver(String PathFirefox, String Geckodriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckodriver);
        driver = new FirefoxDriver();
        return driver;
    }

    //Antes de la primera prueba
    @BeforeAll
    static public void begin() {
        mongoClient = MongoClients.create(URI);
        db = mongoClient.getDatabase("socialNetwork");
        collection = db.getCollection("users");

    }

    //Al finalizar la última prueba
    @AfterAll
    static public void end() {
        //Cerramos el navegador al finalizar las pruebas
        driver.quit();
//        driver.close();
        mongoClient.close();
    }

    //Antes de cada prueba se navega al URL home de la aplicación
    @BeforeEach
    public void setUp() {
        driver.navigate().to(URL);
    }

    //Después de cada prueba se borran las cookies del navegador
    @AfterEach
    public void tearDown() {
        driver.manage().deleteAllCookies();
    }

    /**
     * Here we write the tests, following the pattern speficied in the point "Pruebas automatizadas" of the PDF
     * of the assignment.
     */

//    @Test
//    void generarUsuariosPublicaciones(){
//
////        for (int i = 8; i<=15; i++){
////            String number = String.format("%02d", i);
//            String name = "user15";
//            String email = name + "@email.com";
//            String surname = "Sdi 2022";
//            String password = name;
//            PO_LoginView.login(driver, email, password);
//            PO_View.checkElementBy(driver, "class", "alert alert-success");
//
//            for (int j = 1; j<=10; j++){
//                driver.navigate().to("localhost:3000/publications/add");
//                WebElement title = driver.findElement(By.id("title"));
//                title.click();
//                title.clear();
//                title.sendKeys("Publicacion " + j);
//
//                WebElement content = driver.findElement(By.id("content"));
//                content.click();
//                content.clear();
//                content.sendKeys("my publi");
//
//                WebElement addButton = driver.findElement(By.id("add"));
//                addButton.click();
//            }
//            //logout
//            driver.navigate().to("localhost:3000/users/logout");
////        }
//    }

    /**
     * W1. Registro de usuario con datos válidos
     */
    @Test
    @Order(1)
    void PR01(){
        long initNumberUsers = collection.countDocuments();
        PO_SignUpView.signup(driver, "sarap@uniovi.es", "Paco", "Perez", "123456", "123456");
        String text = "New user successfully registered";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);

        Assertions.assertEquals(initNumberUsers+1, collection.countDocuments()); //one more user

        collection.deleteOne(eq("email", "sarap@uniovi.es"));
    }

    /**
     * W1. Registro de usuario con datos inválidos:
     * 		Campos vacíos (email, nombre, apellidos)
     */
    @Test
    @Order(2)
    void PR02() {
        long initNumberUsers = collection.countDocuments();
        PO_SignUpView.signup(driver, "", "", "", "123456", "123456");

        Assertions.assertEquals(initNumberUsers, collection.countDocuments()); //no user was added

        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Sign up");
        Assertions.assertEquals("Sign up", elements.get(0).getText());
    }

    /**
     * W1. Registro de usuario con datos inválidos
     * 		repetición de contraseña inválida
     */
    @Test
    @Order(3)
    void PR03() {
        long initNumberUsers = collection.countDocuments();
        PO_SignUpView.signup(driver, "sara@uniovi.com", "Paco", "Perez", "123456", "122222");
        String text = "Passwords do not match";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);
        Assertions.assertEquals(initNumberUsers, collection.countDocuments());//no user was added
    }

    /**
     * W1. Registro de usuario con datos inválidos
     * 		email existente
     */
    @Test
    @Order(4)
    void PR04() {
        long initNumberUsers = collection.countDocuments();

        PO_SignUpView.signup(driver, "user01@email.com", "Paco", "Perez", "123456", "123456");

        String text = "Email is already in use";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);

        Assertions.assertEquals(initNumberUsers, collection.countDocuments());//no user was added
    }

    /**
     * W2. Inicio de sesión con datos válidos
     * 		como administrador
     */
    @Test
    @Order(5)
    void PR05() {
        PO_LoginView.login(driver, "admin@email.com" ,"admin");

        String text = "Admin successfully logged in";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);
    }

    /**
     * W2. Inicio de sesión con datos válidos
     * 		como usuario estandar
     */
    @Test
    @Order(6)
    void PR06() {
        PO_LoginView.login(driver, "user01@email.com" ,"user01");

        String text = "User successfully logged in";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);
    }

    /**
     * W2. Inicio de sesión con datos inválidos
     * 		usuario estándar, email y contraseña vacios
     */
    @Test
    @Order(7)
    void PR07() {
        PO_LoginView.login(driver, "" ,"");

        //Se sigue en la vista de login (el h2)
        Assertions.assertEquals("User login", driver.findElement(By.tagName("h2")).getText());
    }

    /**
     * W2. Inicio de sesión con datos inválidos
     * 		usuario estándar, email existente pero contraseña incorrecta
     */
    @Test
    @Order(8)
    void PR08() {
        PO_LoginView.login(driver, "user01@email.com" ,"u");

        String text = "Wrong email or password";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);
    }

    /**
     * W3. Fin de sesión
     * 		comprobar que redirige a login
     */
    @Test
    @Order(9)
    void PR09() {
        //Loggin
        PO_LoginView.login(driver, "user01@email.com" ,"user01");

        String text = "User successfully logged in";
        String str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);

        //logout
        PO_LoginView.logout(driver);

        text = "User successfully logged out";
        str = driver.findElement(By.className("alert")).getText();
        Assertions.assertEquals(text, str);

        //Se redirecciona en la vista de login (el h2)
        Assertions.assertEquals("User login", driver.findElement(By.tagName("h2")).getText());
    }

    /**
     * W3. Fin de sesión
     * 		comprobar que el boton de cerrar sesion no esta visible si el usuario no esta autenticado
     */
    @Test
    @Order(10)
    void PR10() {
        Assertions.assertThrows(NoSuchElementException.class, ()->driver.findElement(By.id("logout-btn")));
    }

    /**
     * W4. Listado de usuarios del sistema: admin
     * Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema
     */
    @Test
    @Order(11)
    void PR11() {

        // Login as admin
        PO_LoginView.login(driver, "admin@email.com", "admin");

        driver.navigate().to("localhost:3000/admin/list");
        int elementos = 0;
        for(int i = 0; i<1; i++){
            elementos += PO_UserListView.countUsersOnPageAdmin(driver, i);
        }

        // TERMINAR CON ASSERT
        Assertions.assertEquals(getNumberOfUsers(), elementos);
    }

    /**
     * W5. Admin: borrado múltiple de usuarios
     * Borrar primer usuario
     */
    @Test
    @Order(12)
    void PR12() {

        // Login as admin
        driver.findElement(By.id("login-btn")).click();
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");

        // Add test user to the bottom
        addUser("testDeleteFirst@email.com", "testDeleteFirst", "test", "standard");

        // Navigate to the admin page
        driver.navigate().to("localhost:3000/admin/list");

        // The first test user of the list
        List<WebElement> elementToRemove = driver.findElements(By.id("testDeleteFirst"));
        Assertions.assertTrue(!elementToRemove.isEmpty());
        elementToRemove.get(elementToRemove.size()-1).click();
        PO_UserListView.delete(driver);
        List<WebElement> elementToRemoveNew = driver.findElements(By.id("testDeleteFirst"));

        // TERMINAR CON ASSERT
        Assertions.assertTrue(elementToRemoveNew.isEmpty()); // The element has been deleted
    }

    /**
     * W5. Admin: borrado múltiple de usuarios
     * Borrar último usuario
     */
    @Test
    @Order(13)
    void PR13() {
        // Login as admin
        driver.findElement(By.id("login-btn")).click();
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");

        // Add test user to the bottom
        addUser("testDelete1@email.com", "testDelete1", "test", "standard");

        // Navigate to the admin page
        driver.navigate().to("localhost:3000/admin/list");
        List<WebElement> elementToRemove = driver.findElements(By.cssSelector("#tableUsers tbody tr td input"));
        int oldSize = elementToRemove.size();
        Assertions.assertTrue(!elementToRemove.isEmpty());
        elementToRemove.get(elementToRemove.size()-1).click();
        PO_UserListView.delete(driver);
        List<WebElement> elementToRemoveNew = driver.findElements(By.cssSelector("#tableUsers tbody tr td input"));
        int newSize = elementToRemoveNew.size();

        // TERMINAR CON ASSERT
        Assertions.assertTrue(newSize == (oldSize - 1));
    }

    /**
     * W5. Admin: borrado múltiple de usuarios
     * Borrar tres usuarios
     */
    @Test
    @Order(14)
    void PR14() {
        // Login as admin
        driver.findElement(By.id("login-btn")).click();
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");

        // Add test users to the bottom
        addUser("testDelete1@email.com", "testDelete1", "test", "standard");
        addUser("testDelete2@email.com", "testDelete2", "test", "standard");
        addUser("testDelete3@email.com", "testDelete3", "test", "standard");

        // Navigate to the admin page
        driver.navigate().to("localhost:3000/admin/list");
        List<WebElement> elementToRemove = driver.findElements(By.cssSelector("#tableUsers tbody tr td input"));
        int oldSize = elementToRemove.size();
        Assertions.assertTrue(!elementToRemove.isEmpty());
        elementToRemove.get(elementToRemove.size()-1).click();
        elementToRemove.get(elementToRemove.size()-2).click();
        elementToRemove.get(elementToRemove.size()-3).click();
        PO_UserListView.delete(driver);
        List<WebElement> elementToRemoveNew = driver.findElements(By.cssSelector("#tableUsers tbody tr td input"));
        int newSize = elementToRemoveNew.size();

        // TERMINAR CON ASSERT
        Assertions.assertTrue(newSize == oldSize-3);
    }

    /**
     * W6. Usuario: listado de usuarios
     * Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema, excepto
     * el propio usuario y aquellos que sean Administradores
     */
    @Test
    @Order(15)
    void PR15() {
        PO_LoginView.login(driver, "user01@email.com", "user01");
        PO_PrivateView.goToUsersList(driver);

        final int numOfAdmins = 1;

        int elementos = 0;
        elementos += PO_UserListView.countUsersOnPage(driver, 1);
        elementos += PO_UserListView.countUsersOnPage(driver, 2);
        elementos += PO_UserListView.countUsersOnPage(driver, 3);
        elementos += PO_UserListView.countUsersOnPage(driver, 4);
        elementos += PO_UserListView.countUsersOnPage(driver, 5);
        elementos += PO_UserListView.countUsersOnPage(driver, 6);

        // all users but the deleted ones and the admin and logged in users
        Assertions.assertEquals(getNumberOfUsers() - (1 + numOfAdmins), elementos);
    }

    /**
     * W7. Buscar usuarios
     * Búsqueda campo vacío
     */
    @Test
    @Order(16)
    void PR16() {
        PO_LoginView.login(driver, "user01@email.com", "user01");
        PO_PrivateView.goToUsersList(driver);

        PO_UserListView.search(driver,"");
        List<WebElement> users = driver.findElements(By.cssSelector("#tableUsers tbody tr"));
        Assertions.assertEquals(5, users.size());
    }

    /**
     * W7. Buscar usuarios
     * Búsqueda texto que no existe
     */
    @Test
    @Order(17)
    void PR17() {
        PO_LoginView.login(driver, "user01@email.com", "user01");
        PO_PrivateView.goToUsersList(driver);

        PO_UserListView.search(driver,"ZXCVBNM");
        List<WebElement> users = driver.findElements(By.cssSelector("#tableUsers tbody tr"));
        Assertions.assertEquals(0, users.size());
    }

    /**
     * W7. Buscar usuarios
     * Búsqueda texto correcto
     */
    @Test
    @Order(18)
    void PR18() {
        PO_LoginView.login(driver, "user01@email.com", "user01");
        PO_PrivateView.goToUsersList(driver);

        PO_UserListView.search(driver,"user02");
        List<WebElement> users = driver.findElements(By.cssSelector("#tableUsers tbody tr"));
        Assertions.assertEquals(1, users.size());
    }



    /**
     * W8. Enviar una invitación de amistad a un usuario
     * Desde el listado de usuarios de la aplicación, enviar una invitación de amistad a un usuario. Comprobar que la
     * solicitud de amistad aparece en el listado de invitaciones.
     */
    @Test
    @Order(19)
    void PR19() {

        // quitar antes las amistades y requests previas si tal

        // log as user01
        PO_LoginView.login(driver, "user01@email.com", "user01");

        // go to the list of users
        driver.navigate().to("http://localhost:3000/users");

        // press send button (user02)
        List<WebElement> addButton = driver.findElements(By.id("addFriendBtn"));
        addButton.get(0).click();

        // logout userX (igual es x url)
        driver.navigate().to("localhost:3000/users/logout");
        //PO_LoginView.logout(driver);

        // log as userY
        PO_LoginView.login(driver, "hola@sara.com", "hola");

        // go to http://localhost:3000/friends/list
        driver.navigate().to("http://localhost:3000/friends/list");

        int requests = 0;
        requests += PO_RequestListView.countRequestsOnPage(driver, 0);

        // check that userX's invite is there (and accept it or not), we'll do it by checking if the email of userX is on page
        SeleniumUtils.textIsPresentOnPage(driver, "hola@sara.es");
        List<WebElement> acceptButton = driver.findElements(By.id("acceptBtn"));
        acceptButton.get(0).click();

        // we could do an assert counting the requests on the page
        Assertions.assertEquals(1, requests);
    }

    /**
     * W8. Enviar una invitación de amistad a un usuario
     * Desde el listado de usuarios de la aplicación, enviar una invitación de amistad a un usuario al que ya le
     * habíamos enviado la invitación previamente. No debería dejarnos enviar la invitación. Se podría ocultar el
     * botón de enviar invitación o notificar que ya había sido enviada previamente.
     */
    @Test
    @Order(20)
    void PR20() {

        // vamos a hacerlo de manera que como en el test anterior enviamos la invitación de sara es a sara com
        // comprobaremos que no se la podemos enviar

        // log as userX
        PO_LoginView.login(driver, "user01@email.es", "user01");

        // either go to a list of users, or to the id of a specified user
        driver.navigate().to("http://localhost:3000/users/user/6279adc8060673b3938c7125");

        // check if it's pending, in that case, 'pending...' appears
        SeleniumUtils.textIsPresentOnPage(driver, "Pending...");

        // no sé si le haría falta un assert

    }

    /**
     * W9. Listar las invitaciones de amistad recibidas
     * Mostrar el listado de invitaciones de amistad recibidas. Comprobar con un listado que contenga varias
     * invitaciones recibidas.
     */
    @Test
    @Order(21)
    void PR21() {

        // log as userA
        PO_LoginView.login(driver, "hola@sara.es", "hola");

        // either go to a list of users, or to the id of a specified user
        driver.navigate().to("http://localhost:3000/users/user/6279adc8060673b3938c7125");

        // press send button (userA -> userB)
        List<WebElement> sendButton = driver.findElements(By.id("sendBtn"));
        sendButton.get(0).click();

        // logout userA (igual es x url)
        driver.navigate().to("localhost:3000/users/logout");
        //PO_LoginView.logout(driver);

        // log as userC
        PO_LoginView.login(driver, "hola@sara2.es", "hola");

        // either go to a list of users, or to the id of a specified user
        driver.navigate().to("http://localhost:3000/users/user/6279adc8060673b3938c7125");

        // press send button (userC -> userB)
        sendButton = driver.findElements(By.id("sendBtn"));
        sendButton.get(0).click();

        // logout userC (igual es x url)
        driver.navigate().to("localhost:3000/users/logout");
        //PO_LoginView.logout(driver);

        ////////////////////////

        // log as userB
        PO_LoginView.login(driver, "hola@sara.com", "hola");

        // go to http://localhost:3000/friends/list
        driver.navigate().to("http://localhost:3000/friends/list");

        int requests = 0;
        requests += PO_RequestListView.countRequestsOnPage(driver, 0);

        // check that userA and userC's invite is there
        //SeleniumUtils.textIsPresentOnPage(driver, "hola@sara.es");
        List<WebElement> acceptButton = driver.findElements(By.id("acceptBtn"));
        acceptButton.get(0).click();

        // we could do an assert counting the requests on the page
        Assertions.assertEquals(2, requests);

    }



    /**
     * W10. Aceptar una invitación recibida
     * Sobre el listado de invitaciones recibidas. Hacer clic en el botón/enlace de una de ellas y comprobar
     * que dicha solicitud desaparece del listado de invitaciones.
     */
    @Test
    @Order(22)
    void PR22() {

        //borrar friendship previa o utilizar otros usuarios

        // log as userX
        PO_LoginView.login(driver, "hola@sara.es", "hola");

        // either go to a list of users, or to the id of a specified user
        driver.navigate().to("http://localhost:3000/users/user/6279adc8060673b3938c7125");

        // press send button (userY)
        List<WebElement> sendButton = driver.findElements(By.id("sendBtn"));
        sendButton.get(0).click();

        // logout userX (igual es x url)
        driver.navigate().to("localhost:3000/users/logout");
        //PO_LoginView.logout(driver);

        // log as userY
        PO_LoginView.login(driver, "hola@sara.com", "hola");

        // go to http://localhost:3000/friends/list
        driver.navigate().to("http://localhost:3000/friends/list");

        int requests = 0;
        requests += PO_RequestListView.countRequestsOnPage(driver, 0);

        // check that userX's invite is there (and accept it or not), we'll do it by checking if the email of userX is on page
        SeleniumUtils.textIsPresentOnPage(driver, "hola@sara.es");
        List<WebElement> acceptButton = driver.findElements(By.id("acceptBtn"));
        acceptButton.get(0).click();

        // we could do an assert counting the requests on the page
        Assertions.assertEquals(1, requests);

    }

    /**
     * W11. Listado de amigos
     * Mostrar el listado de amigos de un usuario
     */
    @Test
    @Order(23)
    void PR23() {
        PO_LoginView.login(driver, "user01@email.com", "user01");
        driver.findElement(By.id("dropdownFriends")).click();
        driver.findElement(By.id("listFriendsOption")).click();

        final int numOfUser01Friends = 4;

        List<WebElement> friends = driver.findElements(By.cssSelector("#tableFriends tbody tr"));
        Assertions.assertEquals(numOfUser01Friends, friends.size());
    }

    /**
     * [Prueba24] Ir al formulario crear publicaciones, rellenarla con datos válidos y pulsar el botón Submit.
     * Comprobar que la publicación sale en el listado de publicaciones de dicho usuario
     */
    @Test
    @Order(24)
    void PR24(){

        PO_LoginView.login(driver, "user06@email.com", "user06");

        driver.navigate().to("localhost:3000/publications/add");
        WebElement title = driver.findElement(By.id("title"));
        title.click();
        title.clear();
        title.sendKeys("test");

        WebElement content = driver.findElement(By.id("content"));
        content.click();
        content.clear();
        content.sendKeys("test");

        WebElement addButton = driver.findElement(By.id("add"));
        addButton.click();

        Assertions.assertTrue(driver.getPageSource().contains("The publication has been added"));

    }

    /**
     * [Prueba25] Ir al formulario de crear publicaciones, rellenarla con datos inválidos (campo título vacío) y
     * pulsar el botón Submit. Comprobar que se muestra el mensaje de campo obligatorio.
     */
    @Test
    @Order(25)
    void PR25(){

        PO_LoginView.login(driver, "user06@email.com", "user06");

        driver.navigate().to("localhost:3000/publications/add");
        WebElement title = driver.findElement(By.id("title"));
        title.click();
        title.clear();
        title.sendKeys(" ");

        WebElement content = driver.findElement(By.id("content"));
        content.click();
        content.clear();
        content.sendKeys("test");

        WebElement addButton = driver.findElement(By.id("add"));
        addButton.click();

        Assertions.assertTrue(driver.getPageSource().contains("Title must not be empty"));

    }

    @Test
    @Order(25)
    void PR25_2(){
        PO_LoginView.login(driver, "user06@email.com", "user06");

        driver.navigate().to("localhost:3000/publications/add");
        WebElement title = driver.findElement(By.id("title"));
        title.click();
        title.clear();
        title.sendKeys("test");

        WebElement content = driver.findElement(By.id("content"));
        content.click();
        content.clear();
        content.sendKeys(" ");

        WebElement addButton = driver.findElement(By.id("add"));
        addButton.click();

        Assertions.assertTrue(driver.getPageSource().contains("Content must not be empty"));

    }

    /**
     * [Prueba26] Mostrar el listado de publicaciones de un usuario y comprobar que se muestran todas las que
     * existen para dicho usuario.
     */
    @Test
    @Order(26)
    void PR26(){
        PO_LoginView.login(driver, "user06@email.com", "user06");

        driver.navigate().to("localhost:3000/publications/listown");

        Assertions.assertTrue(driver.getPageSource().contains("Publications for user06@email.com"));

    }

    /**
     * [Prueba27] Mostrar el listado de publicaciones de un usuario amigo y comprobar que se muestran todas
     * las que existen para dicho usuario.
     */
    @Test
    @Order(27)
    void PR27(){

        //Dos usuarios que son amigos
        String friend1Email = "user06@email.com" ;
        String friend1Password = "user06";
        String friend2Email = "user05@email.com" ;

        PO_LoginView.login(driver, friend1Email, "user06");

        driver.navigate().to("localhost:3000/publications/list/" + friend2Email);

        Assertions.assertTrue(driver.getPageSource().contains("user05@email.com"));

    }


    @Test
    @Order(28)
    void PR28(){
        PO_LoginView.login(driver, "user06@email.com", "user06");

        driver.navigate().to("localhost:3000/publications/list/prueba1@prueba1.com");

        Assertions.assertTrue(driver.getPageSource().contains("You dont have permission to see the publications of this user"));

    }

    /**
     * W15
     * Intentar acceder sin estar autenticado a la opción de listado de usuarios. Se deberá volver al
     * formulario de login.
     */
    @Test
    @Order(29)
    void PR29() {

        // Go to the user page
        driver.navigate().to("localhost:3000/users");

        // Make sure that we have been redirected to the login page
        Assertions.assertEquals(driver.getCurrentUrl(), "http://localhost:3000/users/login");
    }


    /**
     * W15
     * Intentar acceder sin estar autenticado a la opción de listado de invitaciones de amistad recibida
     * de un usuario estándar. Se deberá volver al formulario de login.
     */
    @Test
    @Order(30)
    void PR30() {

        // Go to the friends list page
        driver.navigate().to("localhost:3000/friends/list");

        // Make sure that we have been redirected to the login page
        Assertions.assertEquals(driver.getCurrentUrl(), "http://localhost:3000/users/login");
    }

    /**
     * W15
     * Intentar acceder sin estar autenticado a la opción de listado de invitaciones de amistad recibida
     * de un usuario estándar. Se deberá volver al formulario de login.
     */
    @Test
    @Order(31)
    void PR31() {

        // A user cannot access the friends list of another, as the user in the session is used (see documentation)
    }

    /**
     * C1. Autenticación de usuario
     *      Inicio de sesión con datos válidos
     */
    @Test
    @Order(32)
    void PR32(){
        PO_Api.goToApi(driver);

        PO_Api.fillLoginForm(driver, "user01@email.com", "user01");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "widget-friends");
        Assertions.assertNotNull(result.get(0));
    }

    /**
     * C1. Autenticación de usuario
     *      Inicio de sesión con datos inválidos (usuario no existente)
     */
    @Test
    @Order(33)
    void PR33(){
        PO_Api.goToApi(driver);

        PO_Api.fillLoginForm(driver, "pepe@pepe.com", "pepeluis");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "class", "alert alert-danger");
        Assertions.assertEquals("User not found", result.get(0).getText());
    }

    /**
     * C1. Mostrar lista de amigos
     *      Acceder a la lista de un amigos de un usuario que tenga al menos 3 amigos
     */
    @Test
    @Order(34)
    void PR34(){
        PO_Api.goToApi(driver);
        PO_Api.fillLoginForm(driver, "user01@email.com", "user01");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "widget-friends");
        Assertions.assertNotNull(result.get(0));

        SeleniumUtils.waitLoadElementsBy(driver, "id", "user02@email.com",30);
        SeleniumUtils.waitLoadElementsBy(driver, "id", "user03@email.com",30);
        SeleniumUtils.waitLoadElementsBy(driver, "id", "user04@email.com",30);

        List<WebElement> friendsList = PO_View.checkElementBy(driver, "free", "//tbody/tr");
        Assertions.assertTrue(friendsList.size() >= 3);
    }

    /**
     * C1. Mostrar lista de amigos
     *      Acceder a la lista de un amigos, realizar un filtrado para encontrar
     *      a un amigo concreto
     */
    @Test
    @Order(35)
    void PR35(){
        PO_Api.goToApi(driver);
        PO_Api.fillLoginForm(driver, "user01@email.com", "user01");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "widget-friends");
        Assertions.assertNotNull(result.get(0));

        //filter
        driver.findElement(By.id("filter-by-name")).click();
        driver.findElement(By.id("filter-by-name")).sendKeys("user02");
        SeleniumUtils.waitLoadElementsBy(driver, "id", "user02@email.com",30);

        List<WebElement> friendsList = driver.findElements(By.id("user02@email.com"));;
        Assertions.assertEquals(1, friendsList.size());
    }

    /**
     * C1. Acceder a la lista de mensajes de un amigo, la lista debe contener al menos tres mensajes.
     */
    @Test
    @Order(36)
    void PR36(){
        PO_Api.goToApi(driver);
        PO_Api.fillLoginForm(driver, "user01@email.com", "user01");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "widget-friends");
        Assertions.assertNotNull(result.get(0));

        SeleniumUtils.waitLoadElementsBy(driver, "id", "user02@email.com",30);
        SeleniumUtils.waitLoadElementsBy(driver, "id", "message1user02@email.com",30);

        driver.findElement(By.id("message1user02@email.com")).click();

        SeleniumUtils.waitLoadElementsBy(driver, "text", "how are you",30);

        List<WebElement> friendsList = PO_View.checkElementBy(driver, "free", "//tbody/tr");
        Assertions.assertEquals(3, friendsList.size());
    }

    /**
     * C1. Acceder a la lista de mensajes de un amigo y crear un nuevo mensaje. Validar que el mensaje
     *     aparece en la lista de mensajes.
     */
    @Test
    @Order(37)
    void PR37(){
        PO_Api.goToApi(driver);
        PO_Api.fillLoginForm(driver, "user01@email.com", "user01");

        //redirige a widget-friends
        List<WebElement> result = PO_View.checkElementBy(driver, "id", "widget-friends");
        Assertions.assertNotNull(result.get(0));

        SeleniumUtils.waitLoadElementsBy(driver, "id", "user02@email.com",30);
        SeleniumUtils.waitLoadElementsBy(driver, "id", "message1user02@email.com",30);

        driver.findElement(By.id("message1user02@email.com")).click();

        SeleniumUtils.waitLoadElementsBy(driver, "text", "how are you",30);

        int friendsListSize = PO_View.checkElementBy(driver, "free", "//tbody/tr").size();

        driver.findElement(By.id("message")).click();

        driver.findElement(By.id("message")).sendKeys("this is a test message");

        driver.findElement(By.id("boton-add")).click();
        int newFriendsListSize = PO_View.checkElementBy(driver, "free", "//tbody/tr").size();


        Assertions.assertTrue(newFriendsListSize >= friendsListSize);
    }

    private int getNumberOfUsers(){

        mongoClient = MongoClients.create(URI);
        db = mongoClient.getDatabase("socialNetwork");
        String collectionName = "users";
        MongoCollection userCollection = db.getCollection(collectionName);
        int size = 0;

        try {
            MongoCursor<Document> dbCursor = userCollection.find().iterator();

            while (dbCursor.hasNext()) {
                size++;
                dbCursor.next();
            }

        } catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
        }

        return size;
    }

    private void addUser(String email, String name, String surname, String role){
        MongoCollection userCollection = collection;
        try {
            userCollection.insertOne(new Document()
                    .append("email", email)
                    .append("name", name)
                    .append("surname", surname)
                    .append("password", "test")
                    .append("role", role));
            mongoClient.close();
        } catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
        }
    }
}
