<?php
$con = mysqli_connect("localhost", "root", "root", "hw4");
if($con){
	$url = explode ("/", $_SERVER['REQUEST_URI']);
	if(end($url)=='books'){
		$isbn = "%";
	}
	else{
		$isbn = end($url);
	}
	$arr=[];
	$book = new stdClass();
	$sql = "select isbn, author, title, price, category from books where isbn like '$isbn'";
	$result = mysqli_query($con, $sql);
	if(mysqli_num_rows($result)!=0){
		if(mysqli_num_rows($result) > 1) {
		while($row = mysqli_fetch_assoc($result)){
				$arr[] = $row;
				}
	echo json_encode($arr);

	}
	else{
		$book = mysqli_fetch_assoc($result);
		echo json_encode($book);		
	}
	}
	else{
	echo json_encode($book);

	}

}
else{
	echo "Unable to connect to db".mysqli_connect_errno();
}
?>