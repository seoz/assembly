<?php

// http://likms.assembly.go.kr/bill/jsp/CoactorListPopup.jsp?bill_id=PRC_A1J5J1E1N1K0Q1O4A4V8L1H4C2Q4C9
$url = "http://likms.assembly.go.kr/bill/jsp/CoactorListPopup.jsp?bill_id=";
$build = "PRC_A1J5J1E1N1K0Q1O4A4V8L1H4C2Q4C9";


$ch = curl_init();

curl_setopt( $ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_URL, ($url . $build));

$content = curl_exec($ch);
curl_close($ch);
echo $url . $build;
echo iconv('UTF-8', 'EUC-KR', utf8_decode(strip_tags($content));

echo "한글";

?>
