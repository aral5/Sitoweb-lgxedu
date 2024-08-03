
<?php
// Reindirizza l'utente alla pagina di registrazione
ob_start();
header('Location:app_web.php');
exit; // Assicurati di terminare lo script dopo il reindirizzamento
?>