<?php
$con = mysqli_connect("localhost", "root", "root", "pw6");
if($con){
	$arr=[];
	$sql = "select isbn, author, title, price, category from books";
	$result = mysqli_query($con, $sql);
	if(mysqli_num_rows($result)!=0){
		while($row = mysqli_fetch_assoc($result)){
				$arr[] = $row;
		}
	}
	echo json_encode($arr);
}
else{
	echo "Unable to connect to db".mysqli_connect_errno();
}
?>