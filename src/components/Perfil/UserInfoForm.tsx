import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Avatar,
  Box,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useUser } from "../../contexts/UserContext";

interface UserInfo {
  name: string;
  email: string;
  profilePicture: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

interface UserInfoFormProps {
  initialUserInfo: UserInfo;
  onSubmit: (userInfo: UserInfo) => void;
  isEditable?: boolean;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  initialUserInfo,
  onSubmit,
  isEditable = true,
}) => {
  const { setUserPhoto, setUserName } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    ...initialUserInfo,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Carrega a imagem e o nome do localStorage quando o componente é montado
    const savedImage = localStorage.getItem("userProfilePicture");
    const savedName = localStorage.getItem("userName");
    if (savedImage) {
      setUserInfo((prevInfo) => ({ ...prevInfo, profilePicture: savedImage }));
    }
    if (savedName) {
      setUserInfo((prevInfo) => ({ ...prevInfo, name: savedName }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.newPassword !== userInfo.confirmNewPassword) {
      // lógica para mostrar um erro ao usuário
      console.error("As senhas não coincidem");
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    setIsLoading(true);

    setTimeout(() => {
      onSubmit(userInfo);
      setUserName(userInfo.name);
      setUserPhoto(userInfo.profilePicture); // Atualiza a foto no contexto global
      localStorage.setItem("userName", userInfo.name); // Salva o nome no local storage
      setIsLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          profilePicture: result,
        }));
        setUserPhoto(result); // Atualiza a foto no contexto global
        localStorage.setItem("userProfilePicture", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "flex-start",
        marginLeft: "-15px",
        marginTop: "30px",
        marginRight: "50px",
      }}
    >
      <Box sx={{ position: "relative", marginBottom: "30px" }}>
        <Avatar
          src={userInfo.profilePicture}
          sx={{ width: 100, height: 100, margin: "20px auto" }}
        />
        {isEditable && (
          <Box
            sx={{
              position: "absolute",
              bottom: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
            }}
          >
            <IconButton
              onClick={handlePhotoClick}
              size="small"
              sx={{ bgcolor: "background.paper" }}
            >
              <PhotoLibraryIcon />
            </IconButton>
            <IconButton
              onClick={handleCameraClick}
              size="small"
              sx={{ bgcolor: "background.paper" }}
            >
              <CameraAltIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Nome"
        name="name"
        value={userInfo.name}
        onChange={handleChange}
        disabled={!isEditable}
      />
      <TextField
        fullWidth
        margin="normal"
        label="E-mail"
        name="email"
        type="email"
        value={userInfo.email}
        onChange={handleChange}
        disabled={!isEditable}
      />
      {isEditable && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Senha Atual"
            name="currentPassword"
            type="password"
            value={userInfo.currentPassword || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nova Senha"
            name="newPassword"
            type="password"
            value={userInfo.newPassword || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Nova Senha"
            name="confirmNewPassword"
            type="password"
            value={userInfo.confirmNewPassword || ""}
            onChange={handleChange}
          />
        </>
      )}

      {isEditable && (
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 2,
            width: "100%",
            backgroundColor: "#800080",
            "&:hover": {
              backgroundColor: "#6a006a",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar alterações"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja salvar as alterações?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserInfoForm;
