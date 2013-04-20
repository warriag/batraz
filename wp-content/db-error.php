<?php
    header('HTTP/1.1 503 Service Temporarily Unavailable');
    header('Status: 503 Service Temporarily Unavailable');
    header('Retry-After: 600'); // 1 hour = 3600 seconds
    // Alert yourself
    //mail("alexavagliano@hotmail.it", "Database Error", "There is a problem with the database!", "From: Db Error");
    if($wpdb){
     //   $subject = serialize($wpdb->error);
        $subject =  print_r($wpdb->error, true);
    }else{
        $subject = "There is a problem with the database!";
    }
    
    mail("alexavagliano@hotmail.it", "Database Error", $subject );
  
?>
<!DOCTYPE html>
<html lang="en-US" dir="ltr">
<head>
	<title>There's a hole in the bucket, dear Liza, a hole!</title>
	<meta charset="utf-8" />
	<style>
	body {
		background: #fff;
		font: 16px Georgia, serif;
		line-height: 1.3;
		margin: 0;
		padding: 0;
	}

	#content {
		background: #fff url(/wp-content/images/hole.jpg) no-repeat left top;
		height: 225px;
		margin: 80px auto 0;
		padding: 75px 50px 0 400px;
		width: 375px;
	}

	h1 {
		font-size: 34px;
		font-weight: normal;
		margin-top: 0;
	}

	p {
		margin: 0 0 10px 5px;
	}
	</style>
</head>
<body>

<div id="content">
	<h1>Whoops!</h1>
	<p>Something went wrong, and we're trying to figure out what. Check back soon!</p>
       
</div><!-- #content -->

</body>
</html>
<?php die(); ?>