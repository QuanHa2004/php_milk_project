<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

class Mailer {
    public static function send($to, $subject, $body) {
        $mail = new PHPMailer(true);

        try {
            // Cấu hình SMTP
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';   // SMTP server
            $mail->SMTPAuth   = true;
            $mail->Username   = 'hahongquan2004@gmail.com'; // Email gửi đi
            $mail->Password   = 'siqg mpuk bcnu yfym';    // App password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Người gửi
            $mail->setFrom('hahongquan2004@gmail.com', 'Fresh Milk');

            // Người nhận
            $mail->addAddress($to);

            // Nội dung
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = strip_tags($body);

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Mailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}
