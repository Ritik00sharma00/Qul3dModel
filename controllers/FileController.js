import path from 'path';
import User from '../models/User.js';




// export const handleFileUpload = async (req, res) => {
//   try {
//     const { userinteraction } = req.body;
//     const file = req.file;
//     const { email } = req.params;

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("Email not found");
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const filePath = `/assets/${email}/${file.filename}`;

//     let parsedInteraction = null;

//     if (userinteraction) {
//       try {
//         parsedInteraction = JSON.parse(userinteraction);
//       } catch (error) {
//         console.error("JSON parse error for userinteraction:", error);
//         return res.status(400).json({ message: 'Invalid JSON format for userinteraction' });
//       }
//     }

//     const fileData = {
//       filename: file.originalname,
//       filetype: path.extname(file.originalname),
//       filepath: filePath,
//       user_interaction: parsedInteraction,  // ✅ Send parsed object here
//     };

//     user.uploaded_files.push(fileData);
//     await user.save();

//     return res.status(200).json({
//       message: 'File uploaded and saved successfully',
//       file: fileData,
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({ message: 'Server error during upload', error: error.message });
//   }
// };


const handleFileUpload = async (req, res) => {
  try {
    const { userinteraction } = req.body;
    const file = req.file;
    const { email } = req.params;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email not found");
      return res.status(404).json({ message: "User not found" });
    }

    const filePath = `/assets/${email}/${file.filename}`;

    let parsedInteraction = null;
    if (userinteraction) {
      try {
        parsedInteraction = JSON.parse(userinteraction);
      } catch (error) {
        console.error("JSON parse error for userinteraction:", error);
        return res.status(400).json({ message: "Invalid JSON format for userinteraction" });
      }
    }

    const fileData = {
      filename: file.originalname,
      filetype: path.extname(file.originalname).toLowerCase(),
      filepath: filePath,
      user_interaction: parsedInteraction,
    };

    user.uploaded_files.push(fileData);
    await user.save();

    return res.status(200).json({
      message: "File uploaded and saved successfully",
      file: fileData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error during upload", error: error.message });
  }
};




export const getUserFiles = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ files: user.uploaded_files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};





export const updateFileInteraction = async (req, res) => {
  try {
    const { email, fileindex } = req.params;
    const { user_interaction } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = user.uploaded_files[fileindex];

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    let parsedInteraction = null;
    if (user_interaction) {
      try {
        parsedInteraction = JSON.parse(user_interaction);   // ✅ Parse safely
      } catch (error) {
        console.error('Invalid JSON in user_interaction:', error);
        return res.status(400).json({ message: 'Invalid JSON format for user_interaction' });
      }
    }

    file.user_interaction = parsedInteraction;

    await user.save();

    return res.status(200).json({ message: 'Interaction state updated successfully', file });

  } catch (error) {
    console.error('Error updating interaction:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};








export const deleteUserFile = async (req, res) => {
  try {
    const { email, filename } = req.body;

    if (!email || !filename) {
      return res.status(400).json({ message: 'Email and filename are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fileIndex = user.uploaded_files.findIndex(f => f.filename === filename);

    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found for this user' });
    }

    const fileToDelete = user.uploaded_files[fileIndex];

    const absoluteFilePath = path.join(process.cwd(), fileToDelete.filepath);
    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath);
      console.log('File deleted from disk:', absoluteFilePath);
    } else {
      console.warn('File not found on disk:', absoluteFilePath);
    }

    user.uploaded_files.splice(fileIndex, 1);
    await user.save();

    return res.status(200).json({ message: 'File deleted successfully from database and folder' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};







