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
class NotaneitorApplicationTests {
    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";

    // Jonas
    // static String Geckodriver = "C:\\Users\\Alejandro\\Desktop\\SDI-2022\\software\\software\\geckodriver-v0.27.0-win64\\geckodriver.exe";

    // Adrian
    static String Geckodriver = "C:\\Users\\adria\\OneDrive\\Escritorio\\UNIVERSIDAD\\AÑO 3\\SEMESTRE 2\\Sistemas Distribuidos e Internet\\Laboratorio\\Lab5\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";


    //Sara
    //static String Geckodriver = "D:\\UNI\\3º\\2º cuatri\\SDI\\Lab\\sesion05\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Diego
    //static String Geckodriver = "C:\\Users\\dimar\\Desktop\\sdi\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

    //Ari
    //static String Geckodriver = "C:\\Users\\UO270119\\Desktop\\IIS (definitiva)\\3º - Tercero\\Segundo cuatri\\Sistemas Distribuidos e Internet\\Lab\\[materiales]\\5. Selenium\\PL-SDI-Sesión5-material\\PL-SDI-Sesión5-material\\geckodriver-v0.30.0-win64.exe";

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

}
