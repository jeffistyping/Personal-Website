<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['phone']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    exit();
  }

  echo var_dump($_SERVER['ENV'], $_SERVER['BASE']);

$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
try {
    //Server settings
    $mail->SMTPDebug = 1;                                 // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'email-smtp.us-east-1.amazonaws.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'AKIAJEPXLBCMVSP7QTIQ';              // SMTP username
    $mail->Password = 'AgB5rwLhhi8wifCtyutC6NVEa69eHUH9xED4d/HIUebK';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to

    $name = strip_tags(htmlspecialchars($_POST['name']));
    $email = strip_tags(htmlspecialchars($_POST['email']));
    $phone = strip_tags(htmlspecialchars($_POST['phone']));
    $message = strip_tags(htmlspecialchars($_POST['message'])); 
    
    //Recipients
    $mail->setFrom('Lolincoln23@gmail.com', $name);
    $mail->addAddress('Lolincoln23@gmail.com', 'Name');     // Add a recipient



    $body = "You have received a new message from your website contact form"."Here are the details:<br> Name: $name<br> Email: $email<br> Phone: $phone <br> Message: $message";
    //Content
    $mail->isHTML(true);    
    $mail->Subject = "Website Contact Form:  $name";
    $mail->Body    = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    http_response_code(500);
    exit();
}