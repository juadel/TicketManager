
import { Counter } from "../dataLogic/AtomicCounterLogic"
import { counterItem } from "../models/counter"

const counter = new Counter();

export async function createCounter(userID: string): Promise<counterItem>{
    
    const ticket = 0 ;
    const createdCounter= await counter.createCounter(
        { 
            userID: userID,
            ticket: ticket
        }

    );
    return createdCounter;
    
}
export async function increaseCounter(userID: string){
    
    const newCount = await counter.updatecount(userID);
    return newCount

}

export async function isActiveCounter(userID: string){
    const exists = await counter.isActiveCounter(userID)
    return exists
}