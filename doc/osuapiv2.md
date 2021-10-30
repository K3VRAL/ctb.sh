# osu!api-v2
In this document, you will learn and see how easy it is to be able to get access to osu!'s api v2 through the use of registering an OAuth application, using a Client Credentials Grant, and finally gathering data.

**NOTE: If you intend to learn more about why there are this specific parameters we must take to get said data, I would recommend you look into the [osu!web Documentation](https://osu.ppy.sh/docs/index.html), and even still, you will be using the Documenation a lot to make specific requests so it is still recommended that you use it.**

## Table of Contents
**[Getting started](#getting-started)**

**[New OAuth Application](#new-oauth-application)**

**[Client Credentials Grant](#client-credentials-grant)**

**[Using the Access Token](#using-the-access-token)**

**[I want me some data](#i-want-me-some-data)**

**[FAQs](#faqs)**

## Getting started
For the sake of simplicity, the program for this guide that will be used is [Insomnia](https://insomnia.rest/). It's a great program to easily make requests to a website.

If you want to use a programming language instead, that is also doable but it is mandatory that the programming language also has a library to make said GET, POST, etc requests. I have written a [python script](https://github.com/K3VRAL/ctb.sh/blob/master/src/server/data/osu.py) (if you wish to use it as an example or your main script) with the use of an .env file to hide the sensitive data from this git project; though you can modify the variables to your suiting if you wish not to use Insomnia.

Open up Insomnia, on the right click on the white circle with the plus sign in the middle and click on 'New Request' (or do CTRL-N), name your project what ever you want as this doesn't really matter (you can also ignore the field with GET, POST, etc as you can change this whenever you want, this is explained after), and you should have your Insomnia workspace set up to make requests. Good job!

(If you see in the URL and Send field, to the left, you can also see the GET, POST, etc field where you can change what you want to do. If you intend for consistency, efficiency, or some other, you can have multiple projects open, each with their own requests and accompanying URLs.)

## New OAuth Application
Firstly, before we have any rights to use the api, [we will need to get a 'Client ID' and 'Client Secret'](https://osu.ppy.sh/docs/index.html#registering-an-oauth-application).

You will need to login to osu! at osu.ppy.sh. Go to your profile settings and scroll all the way down until you see a section called 'OAuth'.

Click on 'New OAuth Application'; you should see a 'Register a new Oauth application' prompt come up. 

Write down what ever name you want on the 'Application Name' field as this does not matter. The 'Application Callback URL' will be empty so worry not of it. Click 'Register application' once you are done.

You will get a 'Client ID' and 'Client Secret' provided to you. Be absolutely sure you do not give this out to anyone; this has the same value as your password as it can be abused if given to the wrong hands. But let's say someone does know about it and are using it to abuse, you can click on 'Reset client secret' such that the user has no more use to that know secret.

## Client Credentials Grant
Now that we have the 'Client ID' and 'Client Secret', we are going to request with Insomnia for a [Client Credentials token, this will allow us to gain access to the api](https://osu.ppy.sh/docs/index.html#client-credentials-grant).

With Insomnia, and looking at what we need to do to gain said token, we will change the method in Insomnia to **POST** and put **https://osu.ppy.sh/oauth/token** as the URL. What this means is that we are going to send data to the api and receive some data back as well.

In the documentation, it states that it wants 'Body Parameters', specifically;

- **client_id** where you got from registering you OAuth application as 'Client ID'
- **client_secret** where you got from registering you OAuth application as 'Client Secret'
- **grant_type** where the documentation states it must be **client_credentials**
- **scope** where the documentation states it must be **public**.

In Insomnia, we will click on the 'Body' section, click on the arrow next to 'Body' and click on 'JSON'. We will write:
> {"client_id": "YOUR_CLIENT_ID", "client_secret": "YOUR_CLIENT_SECRET", "grant_type": "client_credentials", "scope": "public"}

**NOTE: Make sure that you are using double quotes, not single quotes.**

It is also recommended that in Insomnia, go to Header, click on 'New header' and write **Content-Type** and where 'value' is **application/json**. This means we want the Body parameters to be read as the JSON media type.

Press 'Send' and in the 'Preview', you should see a JSON object with 3 different sections; 'token_type', 'expires_in' you can ignore this, and 'access_token' with a very long string; this is the token we require to access data from osu!'s api.

Yay, that wasn't so hard :d

**NOTE: It is recommended that you save the this data, more importantly, 'token_type' and 'access_token' as these will be the values to gain access to the data.**

## Using the Access Token
At this point, it is recommended you make a new project in Insomnia as that will be your (various) workspace(s) to make the requests you so please.

The documentation states that when we are making requests, we need some data in the 'Header' fields. In Insomnia, click on 'Header' and click on 'New header' where the the field should have **Authorization** and the 'value' should have **token_type access_token** or to be more specific **Bearer AccessTokenIsOneVeryLongAssString**.

## I want me some data
This is the part where I say that it is now mandatory to use the Documentation if you want to make your own requests to gain specific data. I would recommend looking from 'Beatmaps' and below since these will give you necessary information. For now, before you do your own thing, I will give you some examples as a footing before you do your own adventures in the world of osu! api v2.

Before we continue any further, the base URL as stated in the Documentation is **https://osu.ppy.sh/api/[version]/** where version is the version number, and at the moment, we are using v2, so we use **https://osu.ppy.sh/api/v2/**. For all requests as seen in the example and in the documentation, the base URL will supply us as the target and the specific data we want is supplied in the URL parameters.

One last thing, when we make **GET** requests, it's also possible that we may accidentally get the HTML data as well which is not what we want, so in the 'Header', the only things we should include is **Content-Type** with **application/json**, **Accept** with **application/json** (what this means is that we only request for JSON data, not the website itself), and finally, the most important, **Authorization** with **Bearer LoooooooooooooooooongString**, and that should be just about it unless the documentation requests more information to be inputted in the 'Header'.

### Example
Let's say I want a list of users from a specific country. Under 'Rankings' in the documentation, it states that it wants a **GET** request with the URL of **/rankings/{mode}/{type}** with some optional Query parameters. Let's say I want the mode to be 'osu!catch', the type to be 'performance' and the country to be targetted to be 'Korea'.

In Insomnia, the method will be a **GET**, the URL will be **https://osu.ppy.sh/api/v2/rankings/fruits/performance**, and finally, in the 'Query' section, we add a new name with **country** and the value as **KR** (it is required that the value to be the Country Code).

## FAQs
### This worked for be before but now everytime I make a **GET** request, it keeps giving me an error. Why's that?
It may be possible that your token expired; when we request for the access token, we get 3 values, one of them in 'expires_in' where the value is given in seconds. This tells the user how long until the token is usable for until not. It's basically a password that gives rights to get data that also eventually decays. To get around this issue, repeat from **Client Credentials Grant** and below.