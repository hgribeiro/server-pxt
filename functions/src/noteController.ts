import {Response} from "express";
import {db} from "./config/firebase";

type NoteType = {
  title: string,
  text: string,
  coverImageUrl: string
}

type Request = {
  body: NoteType,
  params: { noteId: string }
}

const addNote = async (req: Request, res: Response):Promise<Response> => {
  const {title, text} = req.body;
  try {
    const note = db.collection("notes").doc();
    const noteObject = {
      id: note.id,
      title,
      text,
    };

    note.set(noteObject);

    return res.status(200).send({
      status: "success",
      message: "note added successfully",
      data: noteObject,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getAllNotes = async (req: Request, res: Response):Promise<Response> => {
  try {
    const allNotes: NoteType[] = [];
    const querySnapshot = await db.collection("notes").get();
    querySnapshot.forEach((doc: any) => allNotes.push(doc.data()));
    return res.status(200).json(allNotes);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateNote = async (req: Request, res: Response):Promise<Response> => {
  const {body: {text, title}, params: {noteId}} = req;

  try {
    const note = db.collection("notes").doc(noteId);
    const currentData = (await note.get()).data() || {};
    const noteObject = {
      id: noteId,
      title: title || currentData.title,
      text: text || currentData.text,
    };

    await note.set(noteObject).catch(
        (error) => {
          return res.status(400).json({
            status: "error",
            message: error.message,
          });
        }
    );

    return res.status(200).json({
      status: "success",
      message: "entry updated successfully",
      data: noteObject,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteNote = async (req: Request, res: Response):Promise<Response> => {
  const {noteId} = req.params;

  try {
    const note = db.collection("notes").doc(noteId);

    await note.delete().catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: "entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export {addNote, getAllNotes, updateNote, deleteNote};
