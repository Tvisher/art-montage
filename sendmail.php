<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';


$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);


$domain_mail = 'mailsend@tvisher.mad-coder.ru'; //Доменный адрес почты
$domain_name = $_SERVER['SERVER_NAME']; // Имя домена
$mail->setFrom($domain_mail, "Сообщение с сайта ${domain_name}"); // От кого письмо
$administrator_email = "tvisher@mail.ru";




if (!empty($_POST['userData'])) {
    $mail->addAddress($administrator_email); // Куда отправить
    $mail->Subject = "Пользователь сайта оставил контактные данные"; // Тема письма


    // Тело письма
    $body = "<h2>Контактные данные пользователя :</h2>";
    if (trim(!empty($_POST['name']))) {
        $name = $_POST['name'];
        $body .= "<p><strong>Имя: </strong> ${name} </p>";
    }

    if (trim(!empty($_POST['email']))) {
        $email = $_POST['email'];
        $body .= "<p><strong>E-mail: </strong> ${email} </p>";
    }

    if (trim(!empty($_POST['phone']))) {
        $phone = $_POST['phone'];
        $body .= "<p><strong>Телефон: </strong> ${phone} </p>";
    }

    $mail->Body = $body;
    if (!$mail->send()) {
        $message = 'Ошибка';
    } else {
        $message = 'Данные отправлены';
    }
}


if (!empty($_POST['50errors'])) {
    $mail->addAddress($_POST['email']);
    $mail->Subject = "11 ошибок при ремонте"; // Тема письма
    $mail->addAttachment(__DIR__ . "/sendFile/11-repair-errors.pdf");
    $mail->Body = "Сообщение с сайта  ${domain_name}";

    if (!$mail->send()) {
        $message = 'Ошибка';
    } else {
        $mail->clearAllRecipients();
        $mail->ClearAttachments();
        $mail->addAddress($administrator_email); // Куда отправить
        $mail->Subject = "Запрос файла 11 ошибок при ремонте"; // Тема письма
        // Тело письма
        $body = "<span>Пользователь получил файл 11 ошибок при ремонте</span>";
        $body .= "<h2>Контактные данные пользователя :</h2>";

        if (trim(!empty($_POST['name']))) {
            $name = $_POST['name'];
            $body .= "<p><strong>Имя: </strong> ${name} </p>";
        }

        if (trim(!empty($_POST['email']))) {
            $email = $_POST['email'];
            $body .= "<p><strong>E-mail: </strong> ${email} </p>";
        }

        if (trim(!empty($_POST['phone']))) {
            $phone = $_POST['phone'];
            $body .= "<p><strong>Телефон: </strong> ${phone} </p>";
        }

        $mail->Body = $body;
        $mail->send();
        $message = 'Данные отправлены';
    }
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
