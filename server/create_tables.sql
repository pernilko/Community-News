DROP TABLE IF EXISTS BRUKER;

CREATE TABLE `BRUKER` (
 `brukerId` int(11) NOT NULL AUTO_INCREMENT,
 `brukernavn` varchar(255) DEFAULT NULL UNIQUE,
 `passord` varchar(255) DEFAULT NULL,
 PRIMARY KEY (`brukerId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS NYHETSSAK;

CREATE TABLE `NYHETSSAK` (
 `saksId` int(11) NOT NULL AUTO_INCREMENT,
 `overskrift` varchar(255) NOT NULL,
 `innhold` varchar(255) NOT NULL,
 `tidspunkt` datetime NOT NULL,
 `bilde` varchar(255) NOT NULL,
 `kategori` enum('Kultur','Sport','Nyheter', 'Annet') DEFAULT NULL,
 `viktighet` BOOLEAN NOT NULL,
 `rating` int(11),
 `brukerId` int(11) NOT NULL,
 PRIMARY KEY (`saksId`),
 KEY `fk_brukerId` (`brukerId`),
 CONSTRAINT `fk_brukerId` FOREIGN KEY (`brukerId`) REFERENCES `BRUKER` (`brukerId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS KOMMENTAR;

CREATE TABLE `KOMMENTAR` (
 `kommId` int(11) NOT NULL AUTO_INCREMENT,
 `kommentar` varchar(255) NOT NULL,
 `saksId` int(11) NOT NULL,
 `nick` varchar(255) DEFAULT NOT NULL,
 PRIMARY KEY (`kommId`),
 KEY `fk_saksId` (`saksId`),
 CONSTRAINT `fk_saksId` FOREIGN KEY (`saksId`) REFERENCES `NYHETSSAK` (`saksId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;