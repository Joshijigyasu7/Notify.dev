"use client"; 
import { useState,useEffect } from "react";
 

export default function Home() { 
   
    //Use state to manage input and notes
    const [place, setPlace] = useState("");
    const [dark, setDark] = useState(false)
    const [alerterr, setAlert] = useState(false)
    const [notes, setnotes] = useState([])
    
    //Saves the Content To Database
    //This function sends a POST request to the server to save the note
    const HandelSubmitDb = async () => {
    const res = await fetch('https://notify-dev-nine.vercel.app/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: place }), 
    })}

    //This function fetches all notes from the database
    //It sends a GET request to the server and updates the state with the fetched notes
    const FetchNotesDb = async () => {
    try {
      const res = await fetch('https://notify-dev-nine.vercel.app/api/blogs/fetchnote');
      const data = await res.json();
      if (data.success) {
        setnotes(data.notes);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }};

  //This function deletes a note from the database
  //It sends a DELETE request to the server with the note ID
  const DeleteItemDb = async (id) => {
  try {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }
    const res = await fetch(`https://notify-dev-nine.vercel.app/api/blogs/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    const result = await res.json();
  } catch (err) {
    console.error(err);
  }
};
    // Handle input change
  //This function updates the input state when the user types in the input field
  const HandelInputChange = (e) => {
    setPlace(e.target.value);
  }

  //This function handles the removal of all notes from the database
  //It prompts the user for confirmation and deletes all notes if confirmed
  const HandelRemoveAll = async () => {
    if (notes.length === 0) {
      alert("Nothing to remove");
      return;
    }
    const confirmRemove = window.confirm("Are you sure you want to remove all items?");
    if (confirmRemove) {
      try {
        for (const item of notes) {
          await DeleteItemDb(item._id);
        }
        await FetchNotesDb();
      } catch (error) {
        console.error("Failed to remove all notes:", error);
      }
    }
  }

  const HandelClick = async () => {
    if (place.trim() === "") {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 500);
      return;
    }
    try {
      await HandelSubmitDb();
      await FetchNotesDb();
      setPlace(""); // Clear input after submission
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  }
   // This function handles the Enter key press in the input field
  const HandelKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();  
      HandelClick();
    }
  }
 
  // Fetch notes when the component mounts
  useEffect(() => {
     
    FetchNotesDb();
  }, []);


  // Dark mode toggle effect
  useEffect(() => {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark-mode')
  } else {
    root.classList.remove('dark-mode')
  }
  }, [dark])
  
 
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around sm:p-20 px-4 py-10 font-sans  min-h-screen">
  <div className="flex flex-col gap-16 w-full sm:w-1/2">
    
    <div className="text-center p-6 rounded-2xl font-serif   text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 shadow-lg">
      NOTIFY — Your Daily Note Keeper
    </div>
    
    <div className="flex card flex-col items-center justify-center bg-yellow-100 p-6 rounded-2xl shadow-md w-full max-w-md gap-4">
      
      <label className="w-full text-sm font-medium text-gray-700">
        Name:
        <input
          value={place}
          className="mt-1 w-full bg-white rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm transition"
          type="text"
          onChange={HandelInputChange}
          onKeyDown={HandelKey}
        />
      </label>
      
      {alerterr && (
        <div className="text-red-600 text-sm mb-2">Please enter a valid name</div>
      )}
      
      <button
        type="submit"
        onClick={HandelClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
      >
        Submit Now
      </button>
      
      <button
        onClick={HandelRemoveAll}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
      >
        Remove All
      </button>
    </div>
  </div>

  <div className="hidden sm:block w-[2px] h-[400px] mx-8 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-full shadow-md mx-10"></div>

  <div className="flex flex-col gap-16 w-full sm:w-1/2 mt-10 sm:mt-0">
    <div>
      <ul className="list-disc text-center flex flex-col items-center bg-green-50 p-7 rounded-xl gap-3 shadow-inner">
        {notes.length === 0 ? (
          <li className="text-gray-500 text-lg italic">Nothing to show here</li>
        ) : (
          notes.map((item, index) => (
            <li
              key={index}
              className="text-stone-800 flex items-center justify-between w-full max-w-md bg-white rounded-xl px-4 py-2 shadow-md transition hover:shadow-lg"
            >
              <span>{index + 1}. {item.text}</span>
              <button
                className="ml-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full transition"
                onClick={async () => {
                  try {
                    await DeleteItemDb(item._id);
                    await FetchNotesDb();
                  } catch (error) {
                    console.error("Failed to delete note:", error);
                  }
                }}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>

    <button
      className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md self-center"
      onClick={() => setDark(!dark)}
    >
      Switch to {dark ? 'Light' : 'Dark'} Mode
    </button>
  </div>
</div>

  );
}
