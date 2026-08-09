const OS_STORAGE_PREFIX = 'webos_';

const StorageManager = {
    get(key, defaultValue = null){
        try{
            const item = localStorage.getItem(OS_STORAGE_PREFIX + key);
            return item? JSON.parse(item): defaultValue;
        }catch (e){
            console.warn(`[Storage] Failed to read key "${key}":`, e);
            return defaultValue;
        }
    },

    set(key, value){
        try{
            localStorage.setItem(OS_STORAGE_PREFIX + key, JSON.stringify(value));
        } catch(e){
            console.warn(`[Storage] Failed to write key "${key}":`, e);
        }
    },


        remove(key){
            try{
                localStorage.removeItem(OS_STORAGE_PREFIX +key);
            } catch(e){
                console.warn(`[Storage] Failed to remove "${key}":`, e);
            }
        }
    };