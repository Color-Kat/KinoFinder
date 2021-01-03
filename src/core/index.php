<?php
error_reporting(E_ALL);
session_start();
cors();

// MOVIE DATA BASE (TMDB) API KEY
define("API_KEY", "5d7e03c13c7c90f7fb530d7c065f6650");

// constants for conecting to DB
define("SERVER_NAME", "localhost");
define("DB_NAME", "kinofinder");
define("USER_NAME", "root");
define("PASSWORD", "");

if (!$_SESSION["auth"]) $_SESSION["user_data"] = false;

// $_SESSION["auth"] = false;

$response = [
    "result"=> "",
    "console"=> false // for debugging in the browser console
];

// test session exist
// if(isset($_SESSION['auth'])) $response["console"][] = $_SESSION['auth'];
// else $response["console"][] = 'does not exist';

try {
    $pdo = new PDO(
        "mysql:host=".SERVER_NAME."; dbname=".DB_NAME,
        USER_NAME, PASSWORD,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,] // enable all errors mode
    );
    // $response["console"] = "Connection to db successfull";
}catch (PDOException $err) {
    $response["console"][] = "Connection to db failed: " . $err->getMessage();
}

// do action
switch ($_POST["action"]) {
    case "getAyth":
        // get user data
        if (isset($_SESSION["auth"])) $response['result'] = $_SESSION['user_data'];
        // user is not authorized
        else $response['result'] = false;
        break;
    case "getFilms":
        // Get films (return no imdb id)
        $films = file_get_contents(
            "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" 
            . API_KEY .
            "&language=ru-RU&page=" 
            . $_POST["page"]
        );
        // String to object to results array
        $films = json_decode($films)->results;

        $response["result"] = $films;
        break;
    case "getFilmData":
        $filmId = $_POST["id"];

        // $imdb_id = file_get_contents(
        //     "https://api.themoviedb.org/3/movie/" . $filmId . "/external_ids?api_key=" . API_KEY
        // );
        // $data["imdb_id"] = json_decode($imdb_id)->imdb_id;

        $data = file_get_contents(
            "https://api.themoviedb.org/3/movie/" . $filmId . "?api_key=" . API_KEY . "&language=ru-RU"
        );

        $response["result"] = json_decode($data);
        break;
    case "search":
        $response["result"] = file_get_contents(
            "https://api.themoviedb.org/3/search/movie?api_key="
                . API_KEY . "&language=ru-RU" .
                "&query=" . str_replace(" ", "+", $_POST["query"])
        );
        break;
    case "registration":
        $email = $_POST['email'];
        $nickname = $_POST['nickname'];
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT, ["cost" => 8]);

        try {
            // check if email taken
            $emailExist = $pdo->prepare("SELECT email FROM users WHERE email='$email'");
            $emailExist->execute();

            if ($emailExist->fetch(PDO::FETCH_ASSOC)) {
                $response['console'][] = 'this email is already registred';
                $response['result'] = false;
            }else {

                // registration
                $user = $pdo->prepare("INSERT INTO users (email, nickname, password) VALUES (:email, :nickname, :password)");
                $user->bindParam(':email', $email);
                $user->bindParam(':nickname', $nickname);
                $user->bindParam(':password', $password);
                $user->execute();

                // get user data from id to use this in the future
                $user_id = $pdo->lastInsertId();
                $user_data = $pdo->prepare("SELECT * FROM users WHERE user_id='$user_id'");
                $user_data->execute();

                // user is authorized
                $_SESSION["auth"] = true;
                $_SESSION["user_data"] = $user = $user_data->fetch(PDO::FETCH_ASSOC);

                // successful execution
                $response['result'] = true;
            }
        } catch(PDOException $e) {
            // user is not authorized
            $_SESSION["auth"] = false;
            // delete session with user id
            unset($_SESSION["user_data"]);
            // runtime error :D
            $response['result'] = false;
            $response['console'][] = $e;
        }

        break;
    case "login":
        $email = $_POST['email'];
        $password = $_POST['password'];

        // $result['console'][] = $password;

        try {
            // get user data
            $user = $pdo->prepare("SELECT * FROM users WHERE email='$email'");
            $user->execute();

            if ($userData = $user->fetch(PDO::FETCH_ASSOC)) {
                if (password_verify($password, $userData['password'])) {
                    // successful execution
                    $response['result'] = $userData;
                    // user is authorized
                    $_SESSION["auth"] = true;
                    $_SESSION["user_data"] = $userData;
                }else {
                    $response['result'] = false;
                    $response['console'][] = 'password!';
                }
            } else {
                $response['result'] = false;
            }
        } catch(PDOException $e) {
            // user is not authorized
            $_SESSION["auth"] = false;
            // delete session with user id
            unset($_SESSION["user_data"]);
            // runtime error :D
            $response['result'] = false;
            $response['console'][] = $e;
        }

        break;
    case "add_film_to_history":
        if ($_SESSION['auth']) {
            $film_id = $_POST['film_id'];
            $user_id = $_SESSION['user_data']['user_id'];

            try {
                // get user data
                $user = $pdo->prepare("SELECT history FROM users WHERE user_id='$user_id'");
                $user->execute();
    
                if ($historyJSON = $user->fetch(PDO::FETCH_ASSOC)) {
                    // get movie history
                    $history = json_decode($historyJSON['history'], true);

                    if (!in_array($film_id, $history)){
                        // add film to history
                        $history[] = $film_id;
                        // conert to string
                        $history = json_encode($history);

                        // insert into table
                        $user = $pdo->prepare("UPDATE users SET history = ? WHERE user_id=?");
                        $user->execute([$history, $user_id]);
                    }else {
                        $response['console'] = '1234214';
                    }
                    $response['result'] = true;
                } else {
                    $response['result'] = false;
                }
            } catch(PDOException $e) {
                $response['result'] = false;
                $response['console'][] = $e;
            }
        }else {
            $response['result'] = false;
        }

        break;

    default:
        $response["result"] = false;
        $response["console"][] = "!!!Nothing happened!!!";
        break;
}

// echo $result;
echo json_encode($response);


function cors()
{
    if (isset($_SERVER["HTTP_ORIGIN"])) {
        header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }

    if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {

        if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"]))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]))
            header("Access-Control-Allow-Headers: {$_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]}");
    }
}
