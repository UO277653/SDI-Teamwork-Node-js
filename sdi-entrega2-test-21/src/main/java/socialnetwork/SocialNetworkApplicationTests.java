package socialnetwork;

import org.openqa.selenium.By;
import socialnetwork.pageobjects.*;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import socialnetwork.util.SeleniumUtils;

import java.util.List;

//Ordenamos las pruebas por la anotación @Order de cada método
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SocialNetworkApplicationTests {
    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";

    // Jonas
    // static String Geckodriver = "C:\\Users\\Alejandro\\Desktop\\SDI-2022\\software\\software\\geckodriver-v0.27.0-win64\\geckodriver.exe";

    // Adrian
    // static String Geckodriver = "C:\\Users\\adria\\OneDrive\\Escritorio\\UNIVERSIDAD\\AÑO 3\\SEMESTRE 2\\Sistemas Distribuidos e Internet\\Laboratorio\\Lab5\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";


    //Sara
    //static String Geckodriver = "D:\\UNI\\3º\\2º cuatri\\SDI\\Lab\\sesion05\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Diego
    //static String Geckodriver = "C:\\Users\\dimar\\Desktop\\sdi\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Ari
    static String Geckodriver = "C:\\Users\\UO270119\\Desktop\\IIS (definitiva)\\3º - Tercero\\Segundo cuatri\\Sistemas Distribuidos e Internet\\Lab\\[materiales]\\5. Selenium\\PL-SDI-Sesión5-material\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    static WebDriver driver = getDriver(PathFirefox, Geckodriver);
    static String URL = "http://localhost:3000";

    public static WebDriver getDriver(String PathFirefox, String Geckodriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckodriver);
        driver = new FirefoxDriver();
        return driver;
    }

    //Antes de la primera prueba
    @BeforeAll
    static public void begin() {

    }

    //Al finalizar la última prueba
    @AfterAll
    static public void end() {
        //Cerramos el navegador al finalizar las pruebas
        //driver.quit();
    }

    //Antes de cada prueba se navega al URL home de la aplicación
    @BeforeEach
    public void setUp() {
        driver.navigate().to(URL);
    }

    //Después de cada prueba se borran las cookies del navegador
    @AfterEach
    public void tearDown() {
        //driver.manage().deleteAllCookies();
        //driver.close();
    }

    /**
     * Here we write the tests, following the pattern speficied in the point "Pruebas automatizadas" of the PDF
     * of the assignment.
     */










    /**
     * 4. Listado de usuarios del sistema: admin
     * Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema
     */
    @Test
    @Order(11)
    void PR11() {

        driver.navigate().to("localhost:3000/admin/list");
        int elementos = 0;
        for(int i = 0; i<1; i++){
            elementos += PO_UserListView.countUsersOnPageAdmin(driver, i);
        }

        // TERMINAR CON ASSERT
        Assertions.assertEquals(6, elementos);
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
        PO_LoginView.login(driver, "hola@sara.es", "hola");

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
     * 12. Crear nueva publicación
     * Datos válidos
     */
    @Test
    @Order(24)
    void PR24(){
        PO_LoginView.login(driver, "nopublications@email.com", "123456");

        driver.navigate().to("localhost:3000/publication/listown");
        int publications = PO_PublicationView.countPubliactionsOnPage(driver, 0);
        Assertions.assertTrue(publications == 0);
        driver.navigate().to("localhost:8090/publication/add");
        PO_PublicationView.fillAddPublicationForm(driver, "Dancing on the club", "Having fun with the besties, ;) ");

        driver.navigate().to("localhost:8090/publication/listown");
        publications = PO_PublicationView.countPubliactionsOnPage(driver, 0);
        Assertions.assertTrue(publications == 1);

    }

}
