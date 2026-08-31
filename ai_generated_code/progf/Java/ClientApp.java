package gash.app;

import java.util.Random;

import gash.socket.BasicClient;

/**
 * client - basic chat construct. This varies from our Python and C++ versions
 * as it prompts the use for messages.
 * 
 * @author gash
 * 
 */
public class ClientApp {

	//SIZE OF WHOLE MESSAGE; CHANGE AS NECESSARY
	static int size = 1000;
	//NUMBER OF ITERATIONS TO SEND THE MESSAGE; CHANGE AS NECESSARY 
	static int iter  = 1;
	public ClientApp() {
	}
	
	//Logic Written with routine coding tools
	public static String gen(){
		String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		StringBuilder sb = new StringBuilder();
		Random random = new Random();
        
		for (int i = 0; i < size; i++) {
				int index = random.nextInt(characters.length());
				char randomChar = characters.charAt(index);
				sb.append(randomChar);
		}
		return sb.toString();
	}

	public static void sendToGeneral(BasicClient client, String payload){
		long start = System.nanoTime();
		int chunk_size = 0;
			if(size < 10000){
				chunk_size = size;
			}else{
				chunk_size = size/10;}
		for(int i = 0; i < iter; i++){
			client.sendMessage(payload, chunk_size);
		}
		long end = System.nanoTime();
		//Logic Written with routine coding tools
		double throughput = (size * 1 * 2) / ((end - start) / 1_000_000_000.0);
		System.out.println("Throughput for messages sent, is "+ throughput+" Bytes/second");
	}

	public static void sendToJava(){
		String payload = gen();
		var javaClient = new BasicClient("app", "127.0.0.1", 3000);
		javaClient.connect();
		javaClient.join("pets/dogs");
		sendToGeneral(javaClient, payload);
	}

	public static void sendToCPP(){
		String payload = gen();
		var cppClient = new BasicClient("app", "127.0.0.1", 2000);
		cppClient.connect();
		cppClient.join("pets/dogs");
		sendToGeneral(cppClient, payload);
	}

	public static void sendToPython(){
		String payload = gen();
		var pythonClient = new BasicClient("app", "127.0.0.1", 4000);
		pythonClient.connect();
		pythonClient.join("pets/dogs");
		sendToGeneral(pythonClient, payload);
	}

	public static void main(String[] args) {
		sendToJava();
		sendToPython();
		sendToCPP();
	}
}
