<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title><?php print $this->title.' '.$this->version; ?> - Login</title>
                <link rel="stylesheet" href="Views/LoginForm/css/style.css" type="text/css" media="screen"/>
                <!--[if IE 6]><link rel="stylesheet" href="Views/LoginForm/css/style.ie6.css" type="text/css" media="screen" /><![endif]-->
                <!--[if IE 7]><link rel="stylesheet" href="Views/LoginForm/css/style.ie7.css" type="text/css" media="screen" /><![endif]-->
                <link rel="stylesheet" type="text/css" href="Resources/ext3/resources/css/ext-all.css"/>
                <link rel="stylesheet" type="text/css" href="Resources/ext3/examples/shared/examples.css"/>
                <link rel="stylesheet" type="text/css" href="Resources/ext3/resources/css/xtheme-gray.css"/>
                <link rel="stylesheet" type="text/css" href="Views/LoginForm/css/LoginForm.css"/>

		
                <script type="text/javascript">myLogo = '<?php print $this->logo;?>';</script>
		<script type="text/javascript" src="Resources/ext3/adapter/ext/ext-base.js"></script>
                <script type="text/javascript" src="Resources/ext3/ext-all.js"></script>

                <script type="text/javascript" src="Resources/ext3/examples/ux/xdatefield.js"></script>
                <script type="text/javascript" src="Resources/ext3/examples/shared/examples.js"></script>
		<!--<script type="text/javascript" src="Views/LoginForm/javascript/jquery.js"></script>-->
		<!--<script type="text/javascript" src="Views/LoginForm/javascript/script.js"></script>-->
		<!--<script type="text/javascript" src="Resources/ext3/src/shared/examples.js"></script>-->
		<script type="text/javascript" src="Views/LoginForm/javascript/LoginForm.js"></script>
	</head>
	<body>
		<div id="art-main">
			<div class="art-sheet">
				<div class="art-sheet-tl"></div>
				<div class="art-sheet-tr"></div>
				<div class="art-sheet-bl"></div>
				<div class="art-sheet-br"></div>
				<div class="art-sheet-tc"></div>
				<div class="art-sheet-bc"></div>
				<div class="art-sheet-cl"></div>
				<div class="art-sheet-cr"></div>
				<div class="art-sheet-cc"></div>
				<div class="art-sheet-body">
					<div class="art-header">
						<div class="art-header-clip">
							<div class="art-header-jpeg"></div>
						</div>
						<div class="art-logo">
                                                        <div class="htitle"><?php print $this->title;?>:&nbsp;&nbsp;E<span style="font-weight:normal;">nterprise </span>R<span style="font-weight:normal;">esource </span>P<span style="font-weight:normal;">lanning</span></div>
							<img height="38" src="Resources/images/<?php print $this->logo;?>" alt="logo" />
						</div>
					</div>
					<div class="cleared reset-box"></div>
					<div class="art-content-layout">
						<div class="art-content-layout-row">
							<div class="art-layout-cell art-content">
								<div class="art-post">
									<div class="art-post-body">
										<div class="art-post-inner art-article">
                                                                                        <div style="padding:20px;padding-top:0px;padding-bottom:50px;font-size: 12px;">
                                                                                            <p>
                                                                                                <?php print $this->message;?>
                                                                                            </p>
                                                                                            
                                                                                        </div>
											<div class="art-postcontent" id="maincontent"></div>
											<div class="cleared"></div>
										</div>

										<div class="cleared"></div>
									</div>
								</div>
								<div class="cleared"></div>
							</div>
						</div>
					</div>
					<div class="cleared"></div>
					<div class="art-footer">
						<div class="art-footer-t"></div>
						<div class="art-footer-body">
							<div class="art-footer-text">
								<p>Copyright © 2011 by <a href="http://froot.at" target="_blank">froot.at</a> and <a href="http://widmayer.at" target="_blank">widmayer.at</a></p>
							</div>
							<div class="cleared"></div>
						</div>
					</div>
					<div class="cleared"></div>
				</div>
			</div>
			<div class="cleared"></div>
		</div>
	</body>
</html>
