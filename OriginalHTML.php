<?php
error_reporting(E_ALL);
assert_options(ASSERT_BAIL,     true);

$billid = "PRC_A1J5J1E1N1K0Q1O4A4V8L1H4C2Q4C9";

// open DB
$db = new mysqli("p:localhost", "trend", "", "assembly");
// Check connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

if (!exist($db, billid)) {
  storeContent($db, $billid);
}

function exist($db, $billid) {
  $result = $db->query("SELECT id FROM HTML WHERE id='$billid'");
  return db->fetch_array($result);
}

function storeContent($db, $billid) {
  // http://likms.assembly.go.kr/bill/jsp/CoactorListPopup.jsp?bill_id=PRC_A1J5J1E1N1K0Q1O4A4V8L1H4C2Q4C9
  $courl = "http://likms.assembly.go.kr/bill/jsp/CoactorListPopup.jsp?bill_id=$billid";
  $sumurl = "http://likms.assembly.go.kr/bill/jsp/SummaryPopup.jsp?bill_id=$billid";
  $billurl = "http://likms.assembly.go.kr/bill/jsp/BillDetail.jsp?bill_id=$billid";

  $cocontent = getContentURL($courl);
  if ($cocontent==null) {
    return;
  }

  $sumcontent = getContentURL($sumurl);
  if ($sumcontent==null) {
    return;
  }

  $billcontent = getContentURL($billurl);
  if ($billcontent==null) {
    return;
  }

  $sql = "INSERT INTO HTML SET ";
  $sql .= "id='" . $db->real_escape_string(($billid)) . "'\n";
  $sql .= ", summary='" . $db->real_escape_string(($sumcontent)) . "'\n";
  $sql .= ", coactor='" . $db->real_escape_string(($cocontent)) . "'\n";
  $sql .= ", bill='" . $db->real_escape_string(($billcontent)) . "'\n";

  if ($db->query($sql) === TRUE) {
    echo "New actor record created successfully.\n";
  } else {
    echo "Error: " . $sql . "<br>" . $db->error;
  }
}

// http://likms.assembly.go.kr/bill/jsp/CoactorListPopup.jsp?bill_id=PRC_A1J5J1E1N1K0Q1O4A4V8L1H4C2Q4C9
function getContentURL($url) {
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    if(curl_exec($ch) === false) {
      echo 'Curl error: ' . curl_error($ch);
      return null;
    }

    curl_close($ch);
    echo url;
    return iconv('EUC-KR', 'UTF-8', $content);
}

?>
