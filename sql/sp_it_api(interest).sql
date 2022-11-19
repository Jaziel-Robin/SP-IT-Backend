CREATE TABLE `interest` (
  `interestid` int NOT NULL AUTO_INCREMENT,
  `fk_userid` int NOT NULL,
  `fk_categoryid` int NOT NULL,
  PRIMARY KEY (`interestid`),
  KEY `fk_userid_idx` (`fk_userid`),
  KEY `fk_categoryid_idx` (`fk_categoryid`),
  CONSTRAINT `fk_categoryid` FOREIGN KEY (`fk_categoryid`) REFERENCES `category` (`categoryid`),
  CONSTRAINT `fk_userid` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci