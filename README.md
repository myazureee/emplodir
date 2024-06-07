# Introduction
This is one my recent school projects, where I realized a website which has a login function.
After the Login window you will be redirected to a site which allows you to make SQL statements and show diffrent performance metrics in graphs.
There are a few features this projects covers.

- Login windows with the help of node.js (just JS)
- No access without valid session to the "backend"
- 

In the following part I will show how I did setup 'emplodir'.

Disclaimer: This repository and all associated files are provided "as is" without warranty of any kind. Use of the code, information, and data is at your own risk. The author shall not be liable for any damages, direct or indirect, arising from the use of the materials provided. It is the user’s responsibility to thoroughly test the implementation before deployment and ensure that all security standards are met. This project is intended for educational purposes and should not be used in a production environment without appropriate security measures in place.

# Environment
Since this was just a school project, I do not cover how to make the domain publically available neither how to setup the http-service (node.js) in a DMZ. In a nutshell it is the same, you just setup your http-service on your server in the DMZ and have to allow MySQL (default: 3306) and node.js (default: 3000) port.

# Setup
The setup will be divided in three sections. With the first section being the setup of MySQL. The second section will belong to the setup of node.js. And the third section dedicated for troubleshooting. If you need any tips or help with setting up I will link the respective websites of the used components below.

Helpful Links:

[Node.js](https://nodejs.org/en)

[React](https://react.dev/)

[Chart.js](https://www.chartjs.org/)

[MySQL](https://www.mysql.com/)

## MySQL Setup
This part displays how to correctly install MySQL on an ubuntu server 22.04. The guide can be used for any case where you are utilizing MySQL.

### Installing and configuring MySQL
1. Update your servers package index.
```
sudo apt update
```

2. Install the ```mysql-server``` package
```
sudo apt install mysql-server
```

3. Start the server using the ```systemctl start``` command
```
sudo systemctl start mysql.service
```

4. Now MySQL ist installed. Before we can use MySQL we have to make some necessary changes for it to work flawlessly. First, Open up MySQL
```
sudo mysql
```

5. Use the ```alter user``` command to change the authentication method for root user.
```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

6. Exit MySQL afterwards
```
mysql> exit
```

7. Now run the secure installation script
```
sudo mysql_secure_installation
```

8. Now you need to make two inputs. On the first one you just need to press ```Y``` and on the second one ```2```. Afterwards you can enter a password for root (MAKE IT SECURE, please).

9. Once the script is completed you can revert your changes to root and connect again to mysql
```
sudo mysql
```

10. Then go back to using the default authentication method
```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
```

11. Lets create the users which we will be using later. We are going to create three users.
```
CREATE USER 'emplodir'@'%' IDENTIFIED WITH authentication_plugin BY 'password';
CREATE USER 'emplodir_read'@'%' IDENTIFIED WITH authentication_plugin BY 'password';
CREATE USER 'emplodir_backup'@'%' IDENTIFIED WITH authentication_plugin BY 'password';

GRANT ALL ON emplodir.* TO 'emplodir'@'%';
GRANT SELECT ON emplodir.* TO 'emplodir_read'@'%';
GRANT SELECT, LOCK TABLES, SHOW VIEW *.* TO 'emplodir_backup'@'%';
```
Now apply the privileges
```
FLUSH PRIVILEGES;
```

### MySQL Data
You can choose whatever data you prefer. As a scheme I used the following provided.
