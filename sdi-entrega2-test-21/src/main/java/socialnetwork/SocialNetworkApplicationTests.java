package socialnetwork;

import com.mongodb.MongoException;
import com.mongodb.client.*;
import org.openqa.selenium.By;
import socialnetwork.pageobjects.*;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.List;

//Ordenamos las pruebas por la anotación @Order de cada método
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SocialNetworkApplicationTests {
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
    static String URI = "mongodb+srv://admin:sdi@socialnetwork.ddcue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    static MongoClient mongoClient;
    static MongoDatabase db;

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

        // Login as admin
        driver.findElement(By.id("login")).click();
        PO_LoginView.fillLoginForm(driver, "admin@email.com", "admin");

        driver.navigate().to("localhost:3000/admin/list");
        int elementos = 0;
        for(int i = 0; i<1; i++){
            elementos += PO_UserListView.countUsersOnPageAdmin(driver, i);
        }

        // TERMINAR CON ASSERT
        Assertions.assertEquals(getNumberOfUsers(), elementos);
    }

    /**
     * 5. Admin: borrado múltiple de usuarios
     * Borrar primer usuario
     */
    @Test
    @Order(12)
    void PR12() {

        // Login as admin
        driver.findElement(By.id("login")).click();
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
     * 5. Admin: borrado múltiple de usuarios
     * Borrar último usuario
     */
    @Test
    @Order(13)
    void PR13() {
        // Login as admin
        driver.findElement(By.id("login")).click();
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
     * 5. Admin: borrado múltiple de usuarios
     * Borrar tres usuarios
     */
    @Test
    @Order(14)
    void PR14() {
        // Login as admin
        driver.findElement(By.id("login")).click();
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

    private void addUser(String email, String name, String surname, String role){
        mongoClient = MongoClients.create(URI);
        db = mongoClient.getDatabase("socialNetwork");
        String collectionName = "users";
        MongoCollection userCollection = db.getCollection(collectionName);
        try {
            userCollection.insertOne(new Document()
                    .append("email", email)
                    .append("name", name)
                    .append("surname", surname)
                    .append("password", "test")
                    .append("role", role));
        } catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
        }
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


    @Test
    @Order(24)
    void PR24(){
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("prueba1@prueba1.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("prueba1");

        WebElement login = driver.findElement(By.id("login"));
        login.click();

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

        Assertions.assertTrue(driver.getPageSource().contains("La publicación ha sido añadida"));

    }

    @Test
    @Order(25)
    void PR25(){
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("prueba1@prueba1.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("prueba1");

        WebElement login = driver.findElement(By.id("login"));
        login.click();

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
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("prueba1@prueba1.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("prueba1");

        WebElement login = driver.findElement(By.id("login"));
        login.click();

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

    @Test
    @Order(26)
    void PR26(){
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("onepublicationuser@gmail.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("password");

        WebElement login = driver.findElement(By.id("login"));
        login.click();

        driver.navigate().to("localhost:3000/publications/listown");

        Assertions.assertTrue(driver.getPageSource().contains("test"));

    }

    @Test
    @Order(27)
    void PR27(){
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("usuarioAmigo1@gmail.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("password");

        driver.navigate().to("localhost:3000/publications/list/usuarioAmigo2@gmail.com");

        Assertions.assertTrue(driver.getPageSource().contains("test"));

    }


    @Test
    @Order(28)
    void PR28(){
        driver.navigate().to("localhost:3000/users/login");

        WebElement usernameField = driver.findElement(By.id("email"));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys("usuarioAmigo1@gmail.com");

        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.click();
        passwordField.clear();
        passwordField.sendKeys("password");

        driver.navigate().to("localhost:3000/publications/list/prueba1@prueba1.com");

        Assertions.assertTrue(driver.getPageSource().contains("No tienes permiso para ver las publicaciones de este usuario"));

    }

}
